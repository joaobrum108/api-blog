const express = require('express');
const router = express.Router();
const controllerDados = require('./controller/controllerDatas');
const controllerAniversariante = require('./controller/controllerAniversariante');
const authMiddleware = require('./middlewares/authMiddleware')

/**
 * @openapi
 * /enviarDados:
 *   post:
 *     summary: Envia um novo post
 *     description: Cria um novo post no banco de dados, incluindo título, descrição, categoria, tempo de leitura, data de publicação e autor.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Novo Post"
 *               descricao:
 *                 type: string
 *                 example: "Descrição detalhada do post"
 *               categoria:
 *                 type: string
 *                 example: "Tecnologia"
 *               tempoLeitura:
 *                 type: string
 *                 example: "5 min de leitura"
 *               dataPublicacao:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-28"
 *               autor:
 *                 type: string
 *                 example: "Equipe de RH"
 *     responses:
 *       200:
 *         description: Post criado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: DADOS_SALVOS
 *               message: Dados enviados com sucesso!
 *               data:
 *                 id: 1
 *                 titulo: "Novo Post"
 *                 descricao: "Descrição detalhada do post"
 *                 categoria: "Tecnologia"
 *                 tempoLeitura: "5 min de leitura"
 *                 dataPublicacao: "2025-11-28"
 *                 autor: "Equipe de RH"
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: POST_NAO_ENCONTRADO
 *               error: "Post não encontrado"
 *       500:
 *         description: Erro interno ao salvar post.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_INSERIR_DADOS
 *               error: "Falha ao enviar dados."
 */

router.post('/enviarDados', authMiddleware, controllerDados.enviarDados);

/**
 * @openapi
 * /listarDados:
 *   get:
 *     summary: Lista todos os posts
 *     description: Retorna todos os posts armazenados no banco de dados.
 *     tags:
 *       - Uploads
 *     responses:
 *       200:
 *         description: Lista de posts retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: SUCESSO
 *               data:
 *                 - id: 1
 *                   titulo: "Post 1"
 *                   descricao: "Descrição"
 *                   categoria: "Tecnologia"
 *                   imagem: "imagem1.jpg"
 *       500:
 *         description: Erro ao buscar dados.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_BUSCA_DADOS
 *               error: Falha ao buscar dados.
 */

router.get('/listarDados', authMiddleware,  controllerDados.listarDados);

/**
 * @openapi
 * /buscarDados/{id}:
 *   get:
 *     summary: Busca um post específico
 *     description: Retorna os dados de um post com base no ID informado.
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post a ser retornado
 *     responses:
 *       200:
 *         description: Post encontrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: SUCESSO
 *               data:
 *                 id: 1
 *                 titulo: "Post 1"
 *                 descricao: "Descrição"
 *                 categoria: "Tecnologia"
 *                 imagem: "imagem1.jpg"
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: POST_NAO_ENCONTRADO
 *               error: Post não encontrado.
 *       500:
 *         description: Erro ao buscar post por ID.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_BUSCA_POR_ID
 *               error: Falha ao buscar dados por ID.
 */

router.get('/buscarDados/:id',authMiddleware, controllerDados.buscarDadosPorID);

/**
 * @openapi
 * /atualizarDados/{id}:
 *   put:
 *     summary: Atualiza um post existente
 *     description: Atualiza os dados de um post específico, podendo alterar imagem, título, descrição e categoria.
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Post atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Nova descrição do post"
 *               categoria:
 *                 type: string
 *                 example: "Atualização"
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: SUCESSO_ATUALIZADO
 *               data:
 *                 affectedRows: 1
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: POST_NAO_ENCONTRADO
 *               error: Post não encontrado.
 *       500:
 *         description: Erro ao atualizar post.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_ATUALIZACAO
 *               error: Falha ao atualizar dados.
 */

router.put('/atualizarDados/:id',authMiddleware,  controllerDados.atualizarDadosPorID);

/**
 * @openapi
 * /deletarDados/{id}:
 *   delete:
 *     summary: Deleta um post
 *     description: Remove um post do banco de dados com base no ID informado.
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post a ser deletado
 *     responses:
 *       200:
 *         description: Post deletado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: SUCESSO_DELETADO
 *               data:
 *                 message: Post deletado com sucesso!
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: POST_NAO_ENCONTRADO
 *               error: Post não encontrado.
 *       500:
 *         description: Erro ao deletar post.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_DELETAR_REGISTRO
 *               error: Falha ao deletar registro.
 */

router.delete('/deletarDados/:id',authMiddleware, controllerDados.deletarDadosPorID);

router.post('/aniversariante' , authMiddleware , controllerAniversariante.enviarAniversariante);

router.get('/listarAniversariante',authMiddleware, controllerAniversariante.listarAniversariante);

router.put('/atualizarAniversariante/:id',authMiddleware, controllerAniversariante.atualizarAniversariante);

router.delete('/deletarAniversariante/:id',authMiddleware, controllerAniversariante.deletarAniversariante);

module.exports = router;