const bcrypt = require("bcryptjs");

const users = [
    {
        id: 1,
        nome: "Admin",
        email: "admin@email.com",
        senhaHash: bcrypt.hashSync("admin123", 10),
        endereco: "Av. Central, 100 - São Paulo/SP",
        isAdmin: true,
    },
    {
        id: 2,
        nome: "Maria Silva",
        email: "maria@email.com",
        senhaHash: bcrypt.hashSync("123456", 10),
        endereco: "Rua das Flores, 200 - Rio de Janeiro/RJ",
        isAdmin: false,
    },
];

const products = [
    {
        id: 1,
        nome: "Notebook Pro 15",
        descricao: "Notebook com 16GB de RAM e SSD de 512GB.",
        preco: 4500,
        categoria: "eletronicos",
        estoque: 10,
    },
    {
        id: 2,
        nome: "Smartphone X",
        descricao: "Smartphone com câmera de 108MP e tela AMOLED.",
        preco: 2500,
        categoria: "eletronicos",
        estoque: 25,
    },
    {
        id: 3,
        nome: "Fone de Ouvido Bluetooth",
        descricao: "Fone com cancelamento ativo de ruído.",
        preco: 350,
        categoria: "eletronicos",
        estoque: 40,
    },
    {
        id: 4,
        nome: "Camiseta Básica",
        descricao: "Camiseta 100% algodão, disponível em várias cores.",
        preco: 49.9,
        categoria: "vestuario",
        estoque: 100,
    },
    {
        id: 5,
        nome: "Tênis Corrida Ultra",
        descricao: "Tênis leve e confortável para corrida.",
        preco: 399.9,
        categoria: "vestuario",
        estoque: 15,
    },
    {
        id: 6,
        nome: "Livro: JavaScript Avançado",
        descricao: "Guia completo de JavaScript moderno.",
        preco: 89.9,
        categoria: "livros",
        estoque: 30,
    },
];

const carts = [];
const orders = [];
const reviews = [];

module.exports = {
    users,
    products,
    carts,
    orders,
    reviews,
};
