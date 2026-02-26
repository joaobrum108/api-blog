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

    async obterConfig(req, res) {
        try {
            const config = await serviceAniversariante.obterConfig();
            return res.status(200).json({ statusCode: 'SUCESSO', data: config });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ statusCode: 'ERRO', error: 'Falha ao obter configuração.' });
        }
    }

    async limparTodos(req, res) {
        try {
            await serviceAniversariante.limparTodos();
            return res.status(200).json({ statusCode: 'SUCESSO_LIMPAR', message: 'Lista de aniversariantes removida com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ statusCode: 'ERRO_LIMPAR', error: 'Falha ao limpar lista.' });
        }
    }

    async importarExcel(req, res) {
        const { aniversariantes } = req.body;

        if (!aniversariantes || !Array.isArray(aniversariantes) || aniversariantes.length === 0) {
            return res.status(400).json({
                statusCode: 'DADOS_AUSENTES',
                error: 'Nenhum aniversariante enviado.'
            });
        }

        try {
            const resultado = await serviceAniversariante.importarAniversariantes(aniversariantes);

            return res.status(201).json({
                statusCode: 'IMPORTACAO_CONCLUIDA',
                message: `${resultado.total} aniversariante(s) importado(s) com sucesso.`,
                data: {
                    total:     resultado.total,
                    ignorados: resultado.ignorados,
                    expiraEm:  resultado.expiraEm
                }
            });

        } catch (error) {
            console.error('Erro ao importar aniversariantes:', error);

            if (error.code === 'SEM_REGISTROS_VALIDOS') {
                return res.status(422).json({
                    statusCode: 'SEM_REGISTROS_VALIDOS',
                    error: 'Nenhum registro válido encontrado.'
                });
            }

            return res.status(500).json({
                statusCode: 'ERRO_IMPORTACAO',
                error: error.message || 'Falha ao importar. Tente novamente.',
                sqlCode: error.code
            });
        }
    }
}

module.exports = new ControllerAniversariante();
