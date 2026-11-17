const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota POST
// /produtos/novo
//router.post('/novo', produtoController.criarProduto);
router.get('/listar', produtoController.buscarTodos);
router.post('/novo', produtoController.salvar);

module.exports = router;