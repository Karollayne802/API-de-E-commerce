// Importa a biblioteca Express
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Importa os roteadores
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders"); // Importa o roteador de pedidos
const reviewRoutes = require("./routes/reviews"); // Importa o roteador de avaliações

// Importa o middleware de logger
const loggerMiddleware = require("./middlewares/loggerMiddleware");

// Cria a aplicação Express
const app = express();

// Middlewares globais
app.use(express.json()); // Permite que a aplicação receba dados em formato JSON
app.use(cookieParser()); // Para parsear cookies
app.use(session({
    secret: 'seu_segredo_secreto', // Use uma string mais segura em produção
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como true em produção com HTTPS
}));
app.use(loggerMiddleware); // Usa o middleware de logging personalizado

// Rota inicial para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// Rotas da API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes); // Usa o roteador de pedidos para /api/orders
app.use("/api/reviews", reviewRoutes); // Usa o roteador de avaliações para /api/reviews

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
