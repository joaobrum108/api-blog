const express = require('express');
const router = express.Router();
const ControllerData = require('./controller/controllerDatas');

// adm
router.post('/enviarDados', ControllerData.enviarDados)
router.get('/obterDados' ,ControllerData.obterDados) 
router.put('/atualizarDados', ControllerData.atualizarDados)
router.delete('/deletarDados', ControllerData.deletarDados)

module.exports = router;