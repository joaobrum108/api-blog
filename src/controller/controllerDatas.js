const serviceDatas = require("../services/serviceDatas");
const STATUS = require("../utils/statusCodes");

class controllerDados {
  async enviarDados(req, res) {
  try {
    const { 
      titulo, 
      descricao, 
      categoria, 
      tempoLeitura, 
      dataPublicacao, 
      autor 
    } = req.body;

    const result = await serviceDatas.serviceEnviarDados({
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      dataPublicacao,
      autor
    });

    return res.status(200).json({
      statusCode: "DADOS_SALVOS",
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



  async listarDados(req, res) {
    try {
      const result = await serviceDatas.serviceListarDados();
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

  async buscarDadosPorID(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceDatas.serviceListarDadosPorID(id);
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

  async atualizarDadosPorID(req, res) {
  try {
    const { id } = req.params;
    const { 
      titulo, 
      descricao, 
      categoria, 
      tempoLeitura, 
      dataPublicacao, 
      autor 
    } = req.body;

    const result = await serviceDatas.serviceAtualizarDados(
      id, 
      titulo, 
      descricao, 
      categoria, 
      tempoLeitura, 
      dataPublicacao, 
      autor
    );

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


  async deletarDadosPorID(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceDatas.serviceDeletarDadosPorID(id);
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

module.exports = new controllerDados();
