const { mysqlCon_LOCAL } = require("../database/conexao");
const fs = require("fs");
const path = require("path");
const STATUS = require("../utils/statusCodes");

class serviceDatas {
  async serviceEnviarDados({ titulo, descricao, categoria, tempoLeitura, autor }) {
  try {
    const sql = `
      INSERT INTO posts 
        (titulo, descricao, categoria, tempoLeitura, autor) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await mysqlCon_LOCAL.execute(sql, [
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      autor
    ]);

    return {
      message: "Dados enviados com sucesso!",
      id: result.insertId,
      titulo,
      descricao,
      categoria,
      tempoLeitura,
      autor
    };
  } catch (error) {
    throw new Error(`${STATUS.ERRO_INSERIR_DADOS}: Falha ao enviar dados`);
  }
}




 async serviceListarDados() {
  try {
    const sql = `
      SELECT 
        id,
        titulo,
        descricao,
        categoria,
        tempoLeitura,
        autor,
        created_at AS dataPublicacao
      FROM posts
    `;
    const [result] = await mysqlCon_LOCAL.execute(sql);
    return result;
  } catch (error) {
    throw new Error(`${STATUS.ERRO_BUSCA_DADOS}`);
  }
}


  async serviceListarDadosPorID(id) {
  try {
    const sql = `
      SELECT 
        id,
        titulo,
        descricao,
        categoria,
        tempoLeitura,
        autor,
        created_at AS dataPublicacao
      FROM posts
      WHERE id = ?
    `;
    const [result] = await mysqlCon_LOCAL.execute(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`${STATUS.ERRO_BUSCA_POR_ID}: Falha ao buscar dados por ID`);
  }
}


  async serviceAtualizarDados(id, titulo, descricao, categoria, tempoLeitura, autor) {
  try {
    // Verifica se o post existe
    const [rows] = await mysqlCon_LOCAL.execute("SELECT id FROM posts WHERE id = ?", [id]); 
    
    if (rows.length === 0) {
      throw new Error(`${STATUS.POST_NAO_ENCONTRADO}: Post não encontrado`);
    }

    // Atualiza apenas os campos relevantes
    const sql = `
      UPDATE posts 
      SET titulo = ?, 
          descricao = ?, 
          categoria = ?, 
          tempoLeitura = ?, 
          autor = ?
      WHERE id = ?
    `;

    const [result] = await mysqlCon_LOCAL.execute(sql, [
      titulo,
      descricao,
      categoria,
      tempoLeitura,
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
      autor
    };
  } catch (error) {
    throw new Error(`${STATUS.ERRO_ATUALIZACAO}: Falha ao atualizar dados - ${error.message}`);
  }
}



  async serviceDeletarDadosPorID(id) {
    const [rows] = await mysqlCon_LOCAL.execute("SELECT id FROM posts WHERE id = ?", [id]);
    if (rows.length === 0) {
      const err = new Error(`${STATUS.POST_NAO_ENCONTRADO}: Post não encontrado`);
      err.statusCode = STATUS.POST_NAO_ENCONTRADO;
      throw err;
    }

    const [result] = await mysqlCon_LOCAL.execute("DELETE FROM posts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      const err = new Error(`${STATUS.ERRO_DELETAR_REGISTRO}: Nenhum registro foi deletado`);
      err.statusCode = STATUS.ERRO_DELETAR_REGISTRO;
      throw err;
    }

    return { message: "Post deletado com sucesso!" };
}


}

module.exports = new serviceDatas();
