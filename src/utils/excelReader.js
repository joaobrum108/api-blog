const XLSX = require("xlsx");

class ExcelReader {
  /**
   * Lê um arquivo Excel e retorna os dados da primeira aba como array de objetos.
   * @param {object} arquivo - Objeto de arquivo do multer (com .path)
   * @returns {Array} Array de objetos com os dados da planilha
   */
  async lerArquivo(arquivo) {
    try {
      // cellDates: true → datas do Excel chegam como Date JS (não serial numérico)
      // defval: ''     → células vazias retornam string vazia ao invés de undefined
      const workbook = XLSX.readFile(arquivo.path, { cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!data || data.length === 0) {
        throw new Error("Nenhum dado encontrado no arquivo Excel");
      }

      return data;
    } catch (e) {
      throw new Error("Erro ao ler o arquivo Excel: " + e.message);
    }
  }
}

module.exports = new ExcelReader();
