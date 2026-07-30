const { carts, products } = require("../utils/mockData");

// Função auxiliar para encontrar o carrinho de um usuário
const findOrCreateCart = (userId) => {
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        userCart = { userId, items: [] };
        carts.push(userCart);
    }
    return userCart;
};

// Adicionar item ao carrinho
exports.addItemToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
    if (product.estoque < quantity) {
        return res.status(400).json({ message: "Quantidade em estoque insuficiente." });
    }

    const userCart = findOrCreateCart(userId);
    const existingItem = userCart.items.find(item => item.productId === parseInt(productId));

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        userCart.items.push({ productId: parseInt(productId), quantity });
    }

    res.status(200).json({ message: "Item adicionado ao carrinho com sucesso!", cart: userCart });
};

// Remover item do carrinho
exports.removeItemFromCart = (req, res) => {
    const { productId } = req.params;
    const userId = req.session.userId;

    const userCart = findOrCreateCart(userId);
    const initialLength = userCart.items.length;
    userCart.items = userCart.items.filter(item => item.productId !== parseInt(productId));

    if (userCart.items.length === initialLength) {
        return res.status(404).json({ message: "Item não encontrado no carrinho." });
    }

    res.status(200).json({ message: "Item removido do carrinho com sucesso!", cart: userCart });
};

// Atualizar quantidade de um item no carrinho
exports.updateCartItemQuantity = (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.session.userId;

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
    if (product.estoque < quantity) {
        return res.status(400).json({ message: "Quantidade em estoque insuficiente." });
    }

    const userCart = findOrCreateCart(userId);
    const existingItem = userCart.items.find(item => item.productId === parseInt(productId));

    if (!existingItem) {
        return res.status(404).json({ message: "Item não encontrado no carrinho." });
    }

    existingItem.quantity = quantity;
    res.status(200).json({ message: "Quantidade do item atualizada com sucesso!", cart: userCart });
};

// Visualizar carrinho atual
exports.viewCart = (req, res) => {
    const userId = req.session.userId;
    const userCart = findOrCreateCart(userId);

    // Adiciona detalhes do produto aos itens do carrinho
    const detailedCartItems = userCart.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, productDetails: product };
    });

    res.status(200).json({ cart: { ...userCart, items: detailedCartItems } });
};
