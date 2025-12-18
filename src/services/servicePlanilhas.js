const ExcelReader = require("../utils/excelReader");
const mysqlCon_LOCAL = require("../database/conexao"); 

class ServicePlanilhas {
    async processarPlanilha(arquivo) { 
        try {

            const dados = await ExcelReader.lerArquivo(arquivo.path);
            
            this.validarDados(dados);
            
      
            const valores = dados.map(row => [
                row.funcionario || row.Funcionario, 
                row.aniversario || row.Aniversario,
                row.cargo || row.Cargo,
                row.centro_de_custos || row['Centro de Custos'] 
            ]);
            
     
            const sql = `INSERT INTO aniversariantes (funcionario, aniversario, cargo, centro_de_custos) VALUES ?`;
            const [result] = await mysqlCon_LOCAL.query(sql, [valores]);
            
            return {
                linhasInseridas: result.affectedRows,
                totalLinhas: dados.length
            };
            
        } catch (error) {
            console.log()
            console.error("Erro ao processar planilha:", error );
            throw new Error(`Erro ao processar planilha: ${error.message}`);
        }
    }
    
    validarDados(dados) {
        if (!dados || dados.length === 0) {
            throw new Error("Planilha vazia ou inválida");
        }
 
        const primeiraLinha = dados[0];
        const colunasNecessarias = ['funcionario', 'aniversario', 'cargo', 'centro_de_custos'];
        
        const temColunas = colunasNecessarias.every(coluna => {
            return primeiraLinha.hasOwnProperty(coluna) || 
                   primeiraLinha.hasOwnProperty(coluna.charAt(0).toUpperCase() + coluna.slice(1)) ||
                   primeiraLinha.hasOwnProperty(coluna.replace(/_/g, ' '));
        });
        
        if (!temColunas) {
            throw new Error(`Planilha deve conter as colunas: ${colunasNecessarias.join(', ')}`);
        }

        dados.forEach((row, index) => {
            if (!row.funcionario && !row.Funcionario) {
                throw new Error(`Linha ${index + 2}: campo 'funcionario' é obrigatório`);
            }
            if (!row.aniversario && !row.Aniversario) {
                throw new Error(`Linha ${index + 2}: campo 'aniversario' é obrigatório`);
            }
        });
    }
}

module.exports = new ServicePlanilhas();