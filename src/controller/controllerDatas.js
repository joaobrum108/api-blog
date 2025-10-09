const serviceDatas = require("../services/serviceDatas");

class ControllerData {
  async sendUploads(req, res) {
    try {
      const { titulo, descricao, categoria } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          statusCode: "NENHUMA_IMAGEM_ENVIADA",
          error: "Envie uma imagem válida.",
        });
      }

      const result = await serviceDatas.ServiceSendUploads(titulo, descricao, categoria, file);

      return res.status(200).json({
        statusCode: "IMAGEM_SALVA",
        message: result.message,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: "ERRO_ENVIO",
        error: error.message,
      });
    }
  }

  async dataUploads(req, res) {
    try {
      const result = await serviceDatas.serviceDataUploads();
      return res.status(200).json({
        statusCode: "SUCESSO",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: "ERRO_ENVIO",
        error: error.message,
      });
    }
  }

  async dataUploadsById(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceDatas.serviceDataUploadsById(id);
      return res.status(200).json({
        statusCode: "SUCESSO",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: "ERRO_ENVIO",
        error: error.message,
      });
    }
  }

  async dataPutUploads(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, categoria } = req.body;
      const novaImagem = req.file ? req.file.filename : null;

      const result = await serviceDatas.serviceDataUpdate(id, titulo, descricao, categoria, novaImagem);

      return res.status(200).json({
        statusCode: "SUCESSO_ATUALIZADO",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: "ERRO_ATUALIZACAO",
        error: error.message,
      });
    }
  }

  async dataDeleteUploads(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceDatas.serviceDataDelete(id);
      return res.status(200).json({
        statusCode: "SUCESSO_DELETADO",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: "ERRO_AO_DELETAR",
        error: error.message,
      });
    }
  }
}

module.exports = new ControllerData();
