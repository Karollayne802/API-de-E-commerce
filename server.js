// Importa a biblioteca Express
const express = require("express");

// Cria a aplicação Express
const app = express();

// Permite que a aplicação receba dados em formato JSON
app.use(express.json());

// Rota inicial para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// Rota para listar os produtos
app.get("/api/products", (req, res) => {
    res.send("Lista de produtos");
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});