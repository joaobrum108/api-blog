const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pastaPlanilhas = path .join(__dirname, '..', 'planilhas');

if(!fs.existsSync(pastaPlanilhas)){
    fs.mkdirSync(pastaPlanilhas , { recursive: true });
    console.log('Pasta planilhas criada automaticamente.');
}

const storage = multer.diskStorage({
    destination: (req , file , cb) =>{
        cb(null , pastaPlanilhas)
    },
    filename: (req , file , cb) => {
        cb(null , file.originalname)
    }
})

const uploadPlanilhas = multer({storage})

module.exports = uploadPlanilhas
