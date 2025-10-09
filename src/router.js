const express = require('express');
const router = express.Router();
const ControllerData = require('./controller/controllerDatas');
const upload = require('./middleware/multer');


router.post('/sendUploads', upload.single('imagem'), ControllerData.sendUploads);


router.get('/dataUploads', upload.single('imagem'), ControllerData.dataUploads);


router.get('/dataUploads/:id', ControllerData.dataUploadsById);1


router.put('/dataPutUploads/:id', upload.single('imagem'), ControllerData.dataPutUploads);


router.delete('/dataDeleteUploads/:id', ControllerData.dataDeleteUploads);


module.exports = router;