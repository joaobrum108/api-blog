const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + path.extname(file.originalname);
    cb(null, nomeUnico); 
  }
});

const upload = multer({ storage });

module.exports = upload;
