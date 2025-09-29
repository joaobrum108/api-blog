/** @format */

const { mysqlCon_LOCAL } = require("../database/conexao");

class serviceDatas {
  async enviarDados(titulo, descricao) {
    try {
      const queryCheck = "SELECT * FROM posts WHERE id = ?";
      const query = "INSERT INTO posts (titulo, descricao) VALUES (?, ?)";
      const [result] = await mysqlCon_LOCAL.execute( queryCheck,query, [titulo, descricao]);
      return { id: result.insertId, titulo, descricao };
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      return { statusCode: "ERROR_AO_ENVIAR_DADOS" };
    }
  }

  async obterDados() {
    try {
      const query = "SELECT * FROM posts";
      const [rows] = await mysqlCon_LOCAL.execute(query);
      return rows;
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      return { statusCode: "ERROR_AO_OBTER_DADOS" };
    }
  }

  async atualizarDados(id, titulo, descricao) {
    try {
      const queryCheck = "SELECT * FROM posts WHERE id = ?";
      const [rows] = await mysqlCon_LOCAL.execute(queryCheck, [id]);
      if (rows.length === 0) {
        return { statusCode: "DADOS_NAO_ENCONTRADOS" };
      }
      const queryUpdate =
        "UPDATE posts SET titulo = ?, descricao = ? WHERE id = ?";
      await mysqlCon_LOCAL.execute(queryUpdate, [titulo, descricao, id]);
      return { id, titulo, descricao };
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      return { statusCode: "ERROR_AO_ATUALIZAR_DADOS" };
    }
  }

    async deletarDados(id) {
    try {
        const queryCheck = "SELECT * FROM posts WHERE id = ?";
        const [rows] = await mysqlCon_LOCAL.execute(queryCheck, [id]);
        if (rows.length === 0) {
            return { statusCode: "DADOS_NAO_ENCONTRADOS" };
        }
        const queryDelet = "DELETE FROM posts WHERE id = ?";
        await mysqlCon_LOCAL.execute(queryDelet, [id]);
        return { statusCode: "DADOS_DELETADOS_COM_SUCESSO" };
    } catch (error) {
        console.error("Erro ao deletar dados:", error);
        return { statusCode: "ERROR_AO_DELETAR_DADOS" };
    }
  }
}

module.exports = new serviceDatas();
