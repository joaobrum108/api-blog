const { mysqlCon_LOCAL } = require("../database/conexao");
const fs = require("fs");
const path = require("path");

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
      const statusCode = "ERRO_ENVIO_DADOS";
      throw new Error(`${statusCode}: Falha ao enviar dados`);
    }
  }

  async serviceDataUploads() {
    try {
      const sql = "SELECT * FROM posts";
      const [result] = await mysqlCon_LOCAL.execute(sql);
      return result;
    } catch (error) {
      const statusCode = "ERRO_BUSCA_DADOS";
      throw new Error(`${statusCode}: Falha ao buscar dados`);
    }
  }

  async serviceDataUploadsById(id) {
    try {
      const sql = "SELECT * FROM posts WHERE id = ?";
      const [result] = await mysqlCon_LOCAL.execute(sql, [id]);
      return result;
    } catch (error) {
      const statusCode = "ERRO_BUSCA_POR_ID";
      throw new Error(`${statusCode}: Falha ao buscar dados por ID`);
    }
  }

  async serviceDataUpdate(id, titulo, descricao, categoria, novaImagem) {
  try {

    const [rows] = await mysqlCon_LOCAL.execute("SELECT imagem FROM posts WHERE id = ?", [id]); 
    
    if (rows.length === 0) {
      const statusCode = "POST_NAO_ENCONTRADO";
      throw new Error(`${statusCode}: Post não encontrado`);
    }

    const imagemAntiga = rows[0].imagem;
    

    if (novaImagem && novaImagem !== imagemAntiga) {

      if (imagemAntiga) {
        const caminhoAntigo = path.resolve(__dirname, "..", "..", "uploads", imagemAntiga);
        if (fs.existsSync(caminhoAntigo)) {
          await fs.promises.unlink(caminhoAntigo);
        }
      }
      

      else {

        const uploadsPath = path.resolve(__dirname, "..", "..", "uploads");
        if (fs.existsSync(uploadsPath)) {
          const files = await fs.promises.readdir(uploadsPath);

          const possivelImagemAntiga = files.find(file => 
            file.includes(id.toString()) || 
            file.startsWith('post_') ||
            file === novaImagem 
          );
          
          if (possivelImagemAntiga) {
            const caminhoPossivel = path.resolve(uploadsPath, possivelImagemAntiga);
            if (fs.existsSync(caminhoPossivel)) {
              await fs.promises.unlink(caminhoPossivel);
            }
          }
        }
      }
    }


    const sql = "UPDATE posts SET titulo = ?, descricao = ?, categoria = ?, imagem = ? WHERE id = ?";
    const [result] = await mysqlCon_LOCAL.execute(sql, [titulo, descricao, categoria, novaImagem, id]);
    
    return result;
    
  } catch (error) {
    const statusCode = "ERRO_ATUALIZACAO";
    throw new Error(`${statusCode}: Falha ao atualizar dados - ${error.message}`);
  }
}

 async serviceDataDelete(id) {
  try {
    const [rows] = await mysqlCon_LOCAL.execute("SELECT imagem FROM posts WHERE id = ?", [id]);
    if (rows.length === 0) {
      const statusCode = "POST_NAO_ENCONTRADO";
      throw new Error(`${statusCode}: Post não encontrado`);
    }

    const nomeImagem = rows[0].imagem;

    if (nomeImagem) {
      const pathDelete = path.resolve(__dirname, "..", "..", "uploads", nomeImagem);
      if (fs.existsSync(pathDelete)) {
        await fs.promises.unlink(pathDelete);
      }
    }

    const [result] = await mysqlCon_LOCAL.execute("DELETE FROM posts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      const statusCode = "ERRO_DELETAR_REGISTRO";
      throw new Error(`${statusCode}: Nenhum registro foi deletado`);
    }

    return { message: "Post deletado com sucesso!" };
  } catch (error) {
    return {
      statusErro: "ERRO_AO_DELETAR",
      error: error.message,
    };
  }
}

}

module.exports = new serviceDatas();
