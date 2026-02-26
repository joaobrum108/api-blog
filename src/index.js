require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Responde ao preflight (OPTIONS) imediatamente sem passar pelo restante da chain
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

const PORT = process.env.PORT || 3000;
app.use('/blog', router)


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

module.exports = app