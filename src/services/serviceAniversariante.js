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
}

module.exports = new ServiceAniversariante();
