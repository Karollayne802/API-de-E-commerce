const users = []; // id, nome, email, senhaHash, endereco, isAdmin
const products = []; // id, nome, descricao, preco, categoria, estoque
const carts = []; // userId, items (produtoId, quantidade)
const orders = []; // id, userId, data, status, itens, total
const reviews = []; // id, productId, userId, nota, comentario, data

module.exports = {
    users,
    products,
    carts,
    orders,
    reviews
};
