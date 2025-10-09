const serviceDatas = require("../services/serviceDatas");
const STATUS = require("../utils/statusCodes");

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
      const [statusCode, message] = error.message.split(":");
      return res.status(500).json({
        statusCode: statusCode || STATUS.ERRO_INSERIR_DADOS,
        error: message?.trim() || "Erro interno ao enviar dados.",
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
      const [statusCode, message] = error.message.split(":");
      return res.status(500).json({
        statusCode: statusCode || STATUS.ERRO_BUSCA_DADOS,
        error: message?.trim() || "Erro interno ao buscar dados.",
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
      const [statusCode, message] = error.message.split(":");
      const httpCode = statusCode === STATUS.POST_NAO_ENCONTRADO ? 404 : 500;
      return res.status(httpCode).json({
        statusCode: statusCode || STATUS.ERRO_BUSCA_POR_ID,
        error: message?.trim() || "Erro ao buscar dados por ID.",
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
      const [statusCode, message] = error.message.split(":");
      const httpCode = statusCode === STATUS.POST_NAO_ENCONTRADO ? 404 : 500;
      return res.status(httpCode).json({
        statusCode: statusCode || STATUS.ERRO_ATUALIZACAO,
        error: message?.trim() || "Erro ao atualizar dados.",
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
      const statusCode = error.statusCode || STATUS.ERRO_DELETAR_REGISTRO;
      const message = error.error || "Erro ao deletar registro.";
      const httpCode = statusCode === STATUS.POST_NAO_ENCONTRADO ? 404 : 500;
      return res.status(httpCode).json({
        statusCode,
        error: message,
      });
    }
  }
}

module.exports = new ControllerData();
