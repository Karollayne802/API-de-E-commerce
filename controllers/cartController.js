const { carts, products } = require("../utils/mockData");

// pega o carrinho do usuário, cria se ainda não existir
const findOrCreateCart = (userId) => {
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        userCart = { userId, items: [] };
        carts.push(userCart);
    }
    return userCart;
};

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
        // se já tem o item, só soma a quantidade (sem estourar o estoque)
        if (existingItem.quantity + quantity > product.estoque) {
            return res.status(400).json({ message: "Quantidade em estoque insuficiente." });
        }
        existingItem.quantity += quantity;
    } else {
        userCart.items.push({ productId: parseInt(productId), quantity });
    }

    res.status(200).json({ message: "Item adicionado ao carrinho com sucesso!", cart: userCart });
};

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

exports.viewCart = (req, res) => {
    const userId = req.session.userId;
    const userCart = findOrCreateCart(userId);

    // manda junto os dados completos de cada produto
    const detailedCartItems = userCart.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { ...item, productDetails: product };
    });

    res.status(200).json({ cart: { ...userCart, items: detailedCartItems } });
};
