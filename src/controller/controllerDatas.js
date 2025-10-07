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

    const result = await serviceDatas.ServiceSendUploads(
      titulo,
      descricao,
      categoria,
      file
    );

    return res.status(200).json({
      statusCode: "IMAGEM_SALVA",
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("Erro no controller:", error);
    return res.status(error.statusCode || 500).json({
      statusCode: "ERRO_ENVIO",
      error: error.message || "Erro ao enviar dados.",
    });
  }
}


  async dataUploads(Req , res){
    try {
      const result = await serviceDatas.serviceDataUploads();
      return res.status(200).json({
        statusCode: "SUCESSO_ENVIO",
        result,
      });
    } catch (e) {
      const statusCode = "ERRO_ENVIO";
      return res.status(500).json({
        statusCode,
        error: e.message,
      });
    }
  }


  async dataUploadsById(Req , res){
    try {
      const result = await serviceDatas.serviceDataUploadsById();
      return res.status(200).json({
        statusCode: "SUCESSO_ENVIO",
        result,
      });
    } catch (e) {
      const statusCode = "ERRO_ENVIO";
      return res.status(500).json({
        statusCode,
        error: e.message,
      });
    }
  }


  async  dataPutUploads(req, res) {
  const { id } = req.params;
  const { titulo, descricao, categoria, imagem } = req.body;

  try {
    const result = await serviceDatas.serviceDataUpdate(id, titulo, descricao, categoria, imagem);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Erro no controller:", error);
    res.status(500).json({ error: "Erro ao atualizar dados" });
  }
}

  async dataDeleteUploads(req , res){
    try {
      const { id } = req.params;
      const result = await serviceDatas.serviceDataDelete(id);
      return res.status(200).json({
        statusCode: "SUCESSO_DELETADO",
        result,
      });
    } catch (e) {
      const statusCode = "ERRO_AO_DELETAR";
      return res.status(500).json({
        statusCode,
        error: e.message,
      });
    }
  }

}
module.exports = new ControllerData();
