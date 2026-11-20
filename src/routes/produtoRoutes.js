const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota POST
// /produtos/novo
router.post('/novo', produtoController.criarProduto);
router.get('/listarTodos', produtoController.listarProdutos);
router.get('/listarPorCodigo', produtoController.listarProdutos);
router.get('/listarPorNome', produtoController.listarProdutos);
router.put('/atualizar/:codigo', produtoController.atualizar);
router.delete('/excluir/:codigo', produtoController.excluir);


module.exports = router;