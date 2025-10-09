const express = require('express');
const router = express.Router();
const controllerDados = require('./controller/controllerDatas');
const upload = require('./middleware/multer');

/**
 * @openapi
 * /enviarDados:
 *   post:
 *     summary: Envia um novo post com imagem
 *     description: Cria um novo post no banco de dados, incluindo título, descrição, categoria e imagem.
 *     tags:
 *       - Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Novo Post"
 *               descricao:
 *                 type: string
 *                 example: "Descrição do post"
 *               categoria:
 *                 type: string
 *                 example: "Tecnologia"
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem salva com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: IMAGEM_SALVA
 *               message: Dados enviados com sucesso!
 *               data:
 *                 titulo: "Novo Post"
 *                 descricao: "Descrição do post"
 *                 categoria: "Tecnologia"
 *                 imagem: "imagem.jpg"
 *       400:
 *         description: Nenhuma imagem enviada.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: NENHUMA_IMAGEM_ENVIADA
 *               error: Envie uma imagem válida.
 *       500:
 *         description: Erro interno ao salvar imagem.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: ERRO_INSERIR_DADOS
 *               error: Falha ao enviar dados.
 */

router.post('/enviarDados', upload.single('imagem'), controllerDados.enviarDados);

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

router.get('/listarDados', upload.single('imagem'), controllerDados.listarDados);

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

router.get('/buscarDados/:id', controllerDados.buscarDadosPorID);

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

router.put('/atualizarDados/:id', upload.single('imagem'), controllerDados.atualizarDadosPorID);

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

router.delete('/deletarDados/:id', controllerDados.deletarDadosPorID);

module.exports = router;
