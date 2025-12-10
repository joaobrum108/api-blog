const servicePlanilhas = require('../services/servicePlanilhas')

class PlanilhasController {
    async uploadPlanilha(req, res) {
        try {
            const arquivo = req.file;
            if (!arquivo) {
                return res.status(400).json({ error: "Nenhum arquivo enviado" });
            }
            const result = await servicePlanilhas.uploadPlanilha(arquivo);
            return res.json({
                mensagem: "Planilha enviada com sucesso",
                dados: result
            });
        } catch (e) {
            console.log("Erro ao receber arquivo:", e);
            return res.status(500).json({ error: "Erro ao receber arquivo" });
        }
    }
}

module.exports = new PlanilhasController()
