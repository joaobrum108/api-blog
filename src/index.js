require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 3000;
app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = app
