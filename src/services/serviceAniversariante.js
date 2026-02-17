const conexao = require('../database/conexao');

class ServiceAniversariante {
    async adicionarAniversariante({ nome, dataAniversario, mensagem }) {
        try {
            const sql = 'INSERT INTO aniversariantes (nome, dataAniversario, mensagem) VALUES (?, ?, ?)';
            const [enviar] = await conexao.mysqlCon_LOCAL.execute(sql, [nome, dataAniversario, mensagem]);
            return { id: enviar.insertId, nome, dataAniversario, mensagem }
        } catch (e) {
            console.error('Erro ao adicionar aniversariante:', e);
            throw e;
        }
    }

    async obterAniversariantes() {
        try {
            const sql = 'SELECT * FROM aniversariantes';
            const [rows] = await conexao.mysqlCon_LOCAL.execute(sql);
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
}

module.exports = new ServiceAniversariante();
