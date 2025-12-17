const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pastaPlanilhas = path .join(__dirname, '..', 'planilhas');

if(!fs.existsSync(pastaPlanilhas)){
    fs.mkdirSync(pastaPlanilhas , { recursive: true });
    console.log('Pasta planilhas criada automaticamente.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaPlanilhas);
  },
  filename: (req, file, cb) => {

    const nomeSeguro = file.originalname
      .normalize("NFD")              
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/\s+/g, "_")          
      .toLowerCase();                 

    cb(null, nomeSeguro);
  }
});


const uploadPlanilhas = multer({storage})

module.exports = uploadPlanilhas
