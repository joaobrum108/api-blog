📦 Projeto: Upload de Posts com Imagem
Este projeto é uma API RESTful desenvolvida com Node.js, Express e MySQL, que permite o envio, consulta, atualização e exclusão de posts contendo título, descrição, categoria e imagem. A documentação está disponível via Swagger.

🚀 Funcionalidades

✅ Enviar post com imagem (multipart/form-data)

📄 Listar todos os posts

🔍 Buscar post por ID

✏️ Atualizar post (com ou sem nova imagem)

🗑️ Deletar post e remover imagem associada

📚 Documentação Swagger integrada

🛠️ Tecnologias Utilizadas
Node.js

Express

MySQL

Multer (upload de arquivos)

Swagger (OpenAPI)

dotenv

fs / path

📂 Estrutura de Pastas

├── controller/
│   └── controllerDatas.js
├── services/
│   └── serviceDatas.js
├── middleware/
│   └── multer.js
├── database/
│   └── conexao.js
├── utils/
│   └── statusCodes.js
├── routes.js
├── app.js

📷 Upload de Imagem
O envio de imagem é feito via multipart/form-data. A imagem é salva na pasta /uploads e associada ao post no banco de dados.

📘 Documentação Swagger


📦 Instalação
bash
git clone [(https://github.com/joaobrum108/api-blog.git](https://github.com/joaobrum108/api-blog.git))
cd seu-repositorio
npm install
Crie um arquivo .env com suas configurações:

env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco

▶️ Execução
bash
node src/index.js

🧪 Testes de API
Postman

Swagger UI (/api-docs)

📌 Observações
Certifique-se de que a pasta /uploads existe e tem permissão de escrita.

Os erros são tratados com statusCode personalizados para facilitar o consumo no front-end.

👨‍💻 Autor
Desenvolvido por Joao Pedro Brum
