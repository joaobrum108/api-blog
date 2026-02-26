const conexao = require('../database/conexao');

// ─── Service ─────────────────────────────────────────────────────────────────

class ServiceAniversariante {

    async adicionarAniversariante({ nome, dataAniversario, mensagem }) {
        try {
            const sql = 'INSERT INTO aniversariantes (nome, dataAniversario, mensagem) VALUES (?, ?, ?)';
            const [enviar] = await conexao.mysqlCon_LOCAL.execute(sql, [nome, dataAniversario, mensagem]);
            return { id: enviar.insertId, nome, dataAniversario, mensagem };
        } catch (e) {
            console.error('Erro ao adicionar aniversariante:', e);
            throw e;
        }
    }

    /**
     * Lista aniversariantes. Antes de retornar, verifica se a lista expirou (1 mês
     * após a última importação). Se expirada, apaga tudo e retorna array vazio.
     */
    async obterAniversariantes() {
        try {
            // Verifica expiração (graceful — ignora se tabela de config não existir ainda)
            try {
                const [config] = await conexao.mysqlCon_LOCAL.execute(
                    'SELECT expiraEm FROM aniversariantes_config WHERE id = 1'
                );
                if (config.length > 0 && new Date(config[0].expiraEm) < new Date()) {
                    console.log('Lista de aniversariantes expirada. Limpando registros...');
                    await conexao.mysqlCon_LOCAL.execute('DELETE FROM aniversariantes');
                    await conexao.mysqlCon_LOCAL.execute('DELETE FROM aniversariantes_config WHERE id = 1');
                    return [];
                }
            } catch { /* config ainda não existe — comportamento normal */ }

            const [rows] = await conexao.mysqlCon_LOCAL.execute('SELECT * FROM aniversariantes ORDER BY dataAniversario');
            return rows;
        } catch (e) {
            console.error('Erro ao listar aniversariantes:', e);
            throw e;
        }
    }

    async atualizarAniversariante(id, { nome, dataAniversario, mensagem }) {
        try {
            const sql = 'UPDATE aniversariantes SET nome = ?, dataAniversario = ?, mensagem = ? WHERE id = ?';
            const [resultado] = await conexao.mysqlCon_LOCAL.execute(sql, [nome, dataAniversario, mensagem, id]);
            return resultado;
        } catch (e) {
            console.error('Erro ao atualizar aniversariante:', e);
            throw e;
        }
    }

    async deletarAniversariante(id) {
        try {
            const sql = 'DELETE FROM aniversariantes WHERE id = ?';
            const [resultado] = await conexao.mysqlCon_LOCAL.execute(sql, [id]);
            return resultado;
        } catch (e) {
            console.error('Erro ao deletar aniversariante:', e);
            throw e;
        }
    }

    /**
     * Retorna as datas de importação e expiração da lista atual.
     * Retorna null se nunca houve importação.
     */
    async obterConfig() {
        try {
            const [rows] = await conexao.mysqlCon_LOCAL.execute(
                'SELECT importadoEm, expiraEm FROM aniversariantes_config WHERE id = 1'
            );
            return rows.length > 0 ? rows[0] : null;
        } catch {
            // Tabela ainda não existe
            return null;
        }
    }

    /**
     * Remove todos os aniversariantes e limpa o registro de importação.
     */
    async limparTodos() {
        const conn = await conexao.mysqlCon_LOCAL.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute('DELETE FROM aniversariantes');
            await conn.execute('DELETE FROM aniversariantes_config WHERE id = 1');
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
    }

    // ─── Importação via Excel ─────────────────────────────────────────────────

    /**
     * Garante que a tabela aniversariantes existe.
     */
    async garantirTabela() {
        await conexao.mysqlCon_LOCAL.execute(`
            CREATE TABLE IF NOT EXISTS aniversariantes (
                id              INT AUTO_INCREMENT PRIMARY KEY,
                nome            VARCHAR(255)    NOT NULL,
                dataAniversario DATE            NOT NULL,
                mensagem        TEXT,
                created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_dataAniversario (dataAniversario)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    /**
     * Garante que a tabela de configuração de expiração existe.
     * Armazena apenas 1 linha (id = 1) com a data da última importação e expiração.
     */
    async garantirTabelaConfig() {
        await conexao.mysqlCon_LOCAL.execute(`
            CREATE TABLE IF NOT EXISTS aniversariantes_config (
                id          INT         PRIMARY KEY DEFAULT 1,
                importadoEm TIMESTAMP   NOT NULL,
                expiraEm    TIMESTAMP   NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    /**
     * Importa lista de aniversariantes em lote com substituição completa.
     * - Apaga todos os registros anteriores
     * - Insere os novos
     * - Salva data de expiração (importação + 1 mês)
     * Tudo em uma única transação — rollback total em caso de falha.
     *
     * @param {Array} aniversariantes - Array de { nome, dataAniversario, mensagem }
     * @returns {{ total: number, ignorados: Array, expiraEm: Date }}
     */
    async importarAniversariantes(aniversariantes) {
        await this.garantirTabela();
        await this.garantirTabelaConfig();

        // Filtra registros com nome válido
        const validos   = [];
        const ignorados = [];

        aniversariantes.forEach((item, idx) => {
            if (!item.nome || item.nome.trim() === '') {
                ignorados.push({ indice: idx, motivo: 'Nome ausente ou vazio' });
                return;
            }
            validos.push({
                nome:            item.nome.trim(),
                dataAniversario: item.dataAniversario || `${new Date().getFullYear()}-01-01`,
                mensagem:        item.mensagem ? item.mensagem.trim() : ''
            });
        });

        if (validos.length === 0) {
            const err = new Error('Nenhum registro válido encontrado.');
            err.code  = 'SEM_REGISTROS_VALIDOS';
            throw err;
        }

        const agora   = new Date();
        const expiraEm = new Date(agora);
        expiraEm.setMonth(expiraEm.getMonth() + 1);

        const CHUNK_SIZE = 100;
        const conn = await conexao.mysqlCon_LOCAL.getConnection();

        try {
            await conn.beginTransaction();

            // Substitui lista completa
            await conn.execute('DELETE FROM aniversariantes');

            // Batch insert em chunks de 100
            for (let i = 0; i < validos.length; i += CHUNK_SIZE) {
                const chunk        = validos.slice(i, i + CHUNK_SIZE);
                const placeholders = chunk.map(() => '(?, ?, ?)').join(', ');
                const valores      = chunk.flatMap(r => [r.nome, r.dataAniversario, r.mensagem]);

                await conn.execute(
                    `INSERT INTO aniversariantes (nome, dataAniversario, mensagem) VALUES ${placeholders}`,
                    valores
                );
            }

            // Registra/atualiza data de expiração
            await conn.execute(`
                INSERT INTO aniversariantes_config (id, importadoEm, expiraEm)
                VALUES (1, ?, ?)
                ON DUPLICATE KEY UPDATE importadoEm = VALUES(importadoEm), expiraEm = VALUES(expiraEm)
            `, [agora, expiraEm]);

            await conn.commit();
            return { total: validos.length, ignorados, expiraEm };

        } catch (e) {
            await conn.rollback();
            console.error('Erro ao importar aniversariantes (rollback efetuado):', e);
            throw e;
        } finally {
            conn.release();
        }
    }
}

module.exports = new ServiceAniversariante();
