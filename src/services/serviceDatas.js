const { mysqlCon_LOCAL } = require("../database/conexao");


class serviceDatas {
  
  async ServiceSendUploads(titulo, descricao, categoria, file) {
  try {
    const sql = "INSERT INTO posts (titulo, descricao, categoria, imagem) VALUES (?, ?, ?, ?)";
    const [result] = await mysqlCon_LOCAL.execute(sql, [
      titulo,
      descricao,
      categoria,
      file.filename,
    ]);

    return {
      message: "Dados enviados com sucesso!",
      titulo,
      descricao,
      categoria,
      imagem: file ? file.filename : null,
    };
  } catch (error) {
    console.error("Erro no service:", error);
    throw new Error("Falha ao enviar dados");
  }
}

async serviceDataUploads() {
  try {
    const sql = "SELECT * FROM posts";
    const [result] = await mysqlCon_LOCAL.execute(sql);
    return result;
  } catch (error) {
    console.error("Erro no service:", error);
    throw new Error("Falha ao buscar dados");
  }

}

async serviceDataUploadsById(id) {
  try {
    const sql = "SELECT * FROM posts WHERE id = ?";
    const [result] = await mysqlCon_LOCAL.execute(sql, [id]);
    return result;
  } catch (error) {
    console.error("Erro no service:", error);
    throw new Error("Falha ao buscar dados");
  }
}

async serviceDataUpdate(id, titulo, descricao, categoria, imagem) {
  try {
    const sql = "UPDATE posts SET titulo = ?, descricao = ?, categoria = ?, imagem = ? WHERE id = ?";
    const [result] = await mysqlCon_LOCAL.execute(sql, [titulo, descricao, categoria, imagem, id]);
    return result;
  } catch (e) {
    console.error("Erro no service:", e);
    throw new Error("Falha ao atualizar dados");
  }
}


async serviceDataDelete(id){
  try {
    const sql = "DELETE FROM posts WHERE id = ?";
    const [result] = await mysqlCon_LOCAL.execute(sql, [id]);
    return result;
  } catch (e) {
    const statusErro = "ERRO_AO_DELETAR";
    return res.status(500).json({
      statusErro,
      error: e.message,
    });
  }
}

}
module.exports = new serviceDatas();
