// src/controllers/produtoController.js
const ProdutoModel = require('../models/produtoModel');

const produtoController = {
  // Método para listar (buscarTodos)
  buscarTodos: async (req, res) => {
    try {
      const produtos = await ProdutoModel.findMany();
      return res.json({
        sucesso: true,
        total: produtos.length,
        produtos
      });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  // Método para cadastrar (salvar)
  salvar: async (req, res) => {
    try {
      const { codigo, nome, quantidade, preco } = req.body;

      if (!codigo || !nome || quantidade === undefined || preco === undefined) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Todos os campos são obrigatórios!'
        });
      }

      const nomeMaiusculo = String(nome).toUpperCase();
      const qtdNum = Number(quantidade);
      const precoNum = Number(preco);
      const valorTotal = Number((qtdNum * precoNum).toFixed(2)); //correção para arredondar o total para 2 casas decimais

      // Salva diretamente utilizando a Model Estática
      const novoProduto = await ProdutoModel.create({
        data: {
          codigo: Number(codigo),
          nome: nomeMaiusculo,
          quantidade: qtdNum,
          preco: precoNum,
          total: valorTotal
        }
      });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Produto cadastrado com sucesso no MySQL!',
        produto: novoProduto
      });
    } catch (error) {
      // Tratamento amigável caso tente cadastrar um código duplicado
      if (error.code === 'P2002') {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Já existe um produto cadastrado com este código!'
        });
      }
      return res.status(500).json({ sucesso: false, erro: error.message });
    }
  }
};

module.exports = produtoController;
