const serviceAniversariante = require('../services/serviceAniversariante');

class ControllerAniversariante {
    async enviarAniversariante(req, res) {
        try {
            const { nome, dataAniversario, mensagem } = req.body;
            if (!nome || !dataAniversario || !mensagem) {
                return res.status(400).json({ statusCode: 'DADOS_INCOMPLETOS', error: 'Nome, data de aniversário e mensagem são obrigatórios.' });
            }
            const resultado = await serviceAniversariante.adicionarAniversariante({ nome, dataAniversario, mensagem });
            res.status(201).json({ statusCode: 'SUCESSO_ADICIONADO', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statusCode: 'ERRO_ADICIONAR', error: 'Falha ao adicionar aniversariante.' });
        }
    }

    async listarAniversariante(req, res) {
        try {
            const aniversariantes = await serviceAniversariante.obterAniversariantes();
            res.status(200).json({ statusCode: 'SUCESSO_LISTAR', data: aniversariantes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statusCode: 'ERRO_LISTAR', error: 'Falha ao listar aniversariantes.' });
        }
    }

    async atualizarAniversariante(req, res) {
        try {
            const { id } = req.params;
            const { nome, dataAniversario, mensagem } = req.body;
            if (!nome || !dataAniversario || !mensagem) {
                return res.status(400).json({ statusCode: 'DADOS_INCOMPLETOS', error: 'Nome, data de aniversário e mensagem são obrigatórios.' });
            }
            const resultado = await serviceAniversariante.atualizarAniversariante(id, { nome, dataAniversario, mensagem });
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ statusCode: 'ANIVERSARIANTE_NAO_ENCONTRADO', error: 'Aniversariante não encontrado.' });
            }
            res.status(200).json({ statusCode: 'SUCESSO_ATUALIZADO', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statusCode: 'ERRO_ATUALIZACAO', error: 'Falha ao atualizar aniversariante.' });
        }
    }

    async deletarAniversariante(req, res) {
        try {
            const { id } = req.params;
            const resultado = await serviceAniversariante.deletarAniversariante(id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ statusCode: 'ANIVERSARIANTE_NAO_ENCONTRADO', error: 'Aniversariante não encontrado.' });
            }
            res.status(200).json({ statusCode: 'SUCESSO_DELETADO', data: { message: 'Aniversariante deletado com sucesso!' } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ statusCode: 'ERRO_DELETAR', error: 'Falha ao deletar aniversariante.' });
        }
    }
}

module.exports = new ControllerAniversariante();
