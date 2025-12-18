const XLSX = require("xlsx");
const fs = require("fs");

class ExcelReader {
  async lerArquivo(arquivo) {
    try {
      const workbook = XLSX.readFile(arquivo.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
    if (!data) {
        throw new Error("Nenhum dado encontrado no arquivo Excel");
      }
      return data;
    } catch (e) {
      throw new Error("Erro ao ler o arquivo Excel");
    }
  }
}


module.exports = new ExcelReader();
