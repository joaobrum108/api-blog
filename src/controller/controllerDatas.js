/** @format */

const serviceDatas = require("../services/serviceDatas");

class ControllerData {
  async enviarDados(req, res) {
    try {
      const { titulo, descricao } = req.body;

      if (!titulo || !descricao) {
        return res
          .status(400)
          .json({ error: "Título e descrição são obrigatórios." });
      }

      const response = await serviceDatas.enviarDados(titulo, descricao);
      const statusCode = "ERROR_AO_ENVIAR_DADOS";

      if (response.statusCode === statusCode) {
        return res.status(500).json({ statusCode });
      }

      res.status(201).json(response);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async obterDados(req, res) {
    try {
      const resp = await serviceDatas.obterDados();
      const statusCode = "ERROR_AO_OBTER_DADOS";

      if (resp.statusCode === statusCode) {
        return res.status(500).json({ statusCode });
      }

      res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizarDados(req, res) {
    try {
      const { id, titulo, descricao } = req.body;
      const resp = await serviceDatas.atualizarDados(id, titulo, descricao);
      if (resp.statusCode === "ERROR_AO_ATUALIZAR_DADOS") {
        return res.status(400).json({ statusCode: "ERROR_AO_ATUALIZAR_DADOS" });
      }
      if (resp.statusCode === "DADOS_NAO_ENCONTRADOS") {
        return res.status(404).json({ statusCode: "DADOS_NAO_ENCONTRADOS" });
      }
      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deletarDados(req, res) {
    try {
      const { id } = req.body;
      const resp = await serviceDatas.deletarDados(id);
      if (resp.statusCode === "ERROR_AO_DELETAR_DADOS") {
        return res.status(400).json({ statusCode: "ERROR_AO_DELETAR_DADOS" });
      }
      if (resp.statusCode === "DADOS_NAO_ENCONTRADOS") {
        return res.status(404).json({ statusCode: "DADOS_NAO_ENCONTRADOS" });
      }
      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ControllerData();
