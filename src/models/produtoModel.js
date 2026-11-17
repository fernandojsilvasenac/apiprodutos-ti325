// src/models/produtoModel.js
const prisma = require('../../database/prisma');

// Exporta o delegado do Prisma para o modelo Produto,
// permitindo chamadas diretas como ProdutoModel.findMany(), ProdutoModel.create(), etc.
const ProdutoModel = prisma.produto;

module.exports = ProdutoModel;
