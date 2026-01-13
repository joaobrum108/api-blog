const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pastaPDFs = path.join(__dirname, '..', 'pdfs');

if (!fs.existsSync(pastaPDFs)) {
    fs.mkdirSync(pastaPDFs, { recursive: true });
    console.log('Pasta pdfs criada automaticamente.');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaPDFs);
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

const uploadPDFs = multer({ storage });

module.exports = uploadPDFs;
