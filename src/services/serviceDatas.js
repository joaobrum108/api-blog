const { mysqlCon_LOCAL } = require("../database/conexao");
const fs = require("fs");
const path = require("path");
const STATUS = require("../utils/statusCodes");

class serviceDatas {
  async serviceEnviarDados({ titulo, descricao, categoria, tempoLeitura, dataPublicacao, autor }) {
  try {
    const sql = `
      INSERT INTO posts 
        (titulo, descricao, categoria, tempoLeitura, dataPublicacao, autor) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await mysqlCon_LOCAL.execute(sql, [
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      dataPublicacao,
      autor
    ]);

    return {
      message: "Dados enviados com sucesso!",
      id: result.insertId,
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      dataPublicacao,
      autor
    };
  } catch (error) {
    throw new Error(`${STATUS.ERRO_INSERIR_DADOS}: Falha ao enviar dados`);
  }
}



  async serviceListarDados() {
    try {
      const sql = "SELECT * FROM posts";
      const [result] = await mysqlCon_LOCAL.execute(sql);
      return result;
    } catch (error) {
      throw new Error(`${STATUS.ERRO_BUSCA_DADOS}`);
    }
  }

  async serviceListarDadosPorID(id) {
    try {
      const sql = "SELECT * FROM posts WHERE id = ?";
      const [result] = await mysqlCon_LOCAL.execute(sql, [id]);
      return result;
    } catch (error) {
      throw new Error(`${STATUS.ERRO_BUSCA_POR_ID}: Falha ao buscar dados por ID`);
    }
  }

  async serviceAtualizarDados(id, titulo, descricao, categoria, tempoLeitura, dataPublicacao, autor) {
  try {

    const [rows] = await mysqlCon_LOCAL.execute("SELECT id FROM posts WHERE id = ?", [id]); 
    
    if (rows.length === 0) {
      throw new Error(`${STATUS.POST_NAO_ENCONTRADO}: Post não encontrado`);
    }

    const sql = `
      UPDATE posts 
      SET titulo = ?, 
          descricao = ?, 
          categoria = ?, 
          tempoLeitura = ?, 
          dataPublicacao = ?, 
          autor = ?
      WHERE id = ?
    `;

    const [result] = await mysqlCon_LOCAL.execute(sql, [
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      dataPublicacao,
      autor,
      id
    ]);
    
    return {
      message: "Post atualizado com sucesso!",
      affectedRows: result.affectedRows,
      id,
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      dataPublicacao,
      autor
    };
  } catch (error) {
    throw new Error(`${STATUS.ERRO_ATUALIZACAO}: Falha ao atualizar dados - ${error.message}`);
  }
}


  async serviceDeletarDadosPorID(id) {
  try {
    const [rows] = await mysqlCon_LOCAL.execute("SELECT id FROM posts WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error(`${STATUS.POST_NAO_ENCONTRADO}: Post não encontrado`);
    }


    const [result] = await mysqlCon_LOCAL.execute("DELETE FROM posts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`${STATUS.ERRO_DELETAR_REGISTRO}: Nenhum registro foi deletado`);
    }

    return { message: "Post deletado com sucesso!" };
  } catch (error) {
    return {
      statusCode: STATUS.ERRO_DELETAR_REGISTRO,
      error: error.message,
    };
  }
}

}

module.exports = new serviceDatas();
