const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const preferencesRoutes = require("./routes/preferences");

const loggerMiddleware = require("./middlewares/loggerMiddleware");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(session({
    secret: 'seu_segredo_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(loggerMiddleware);

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// domínios da API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/products", reviewRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
