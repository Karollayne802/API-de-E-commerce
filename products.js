// importa o Express
const express = require("express");

//Cria um roteador 
const router = express.Router();

// Exportar o roteador 
module.exports = router;

const products = [
    {
    id: 1,
    nome: "Notebook",
    preco: 3000,
    estoque: 5
    }
]