const excelReader = require('../utils/excelReader');

class PlanilhasController {
  async uploadPlanilha(req, res) {
    try {
      const arquivo = req.file;
      
      if (!arquivo) {
        return res.status(400).json({ 
          status: 400,
          statusCode: "ERRO",
          mensagem: "Nenhum arquivo enviado"
        });
      }
      
      const result = await excelReader.lerArquivo(arquivo.path);

      return res.status(200).json({
        status: 200,
        statusCode: "SUCESSO",
        mensagem: "Planilha enviada com sucesso",
        dados: result
      });

    } catch (erro) {
      return res.status(400).json({
        status: 400,
        statusCode: "ERRO",
        mensagem: erro.message,
        dados: []
      });
    }
  }
}

module.exports = new PlanilhasController();
