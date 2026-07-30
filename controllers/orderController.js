const { orders, carts, products } = require("../utils/mockData");

// Função para finalizar compra (converter carrinho em pedido)
exports.checkout = (req, res) => {
    const userId = req.session.userId;
    const userCartIndex = carts.findIndex(cart => cart.userId === userId);

    if (userCartIndex === -1 || carts[userCartIndex].items.length === 0) {
        return res.status(400).json({ message: "Carrinho vazio. Adicione itens antes de finalizar a compra." });
    }

    const userCart = carts[userCartIndex];
    let total = 0;
    const orderItems = [];

    for (const item of userCart.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
            return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
        }
        if (product.estoque < item.quantity) {
            return res.status(400).json({ message: `Estoque insuficiente para o produto ${product.nome}.` });
        }
        total += product.preco * item.quantity;
        orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.preco });
        product.estoque -= item.quantity; // Reduz o estoque
    }

    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        userId,
        data: new Date().toISOString(),
        status: "pendente",
        itens: orderItems,
        total,
    };
    orders.push(newOrder);

    // Limpa o carrinho após a compra
    carts[userCartIndex].items = [];

    res.status(201).json({ message: "Compra finalizada com sucesso!", order: newOrder });
};

// listar histórico de pedidos do usuário
exports.listUserOrders = (req, res) => {
    const userId = req.session.userId;
    const userOrders = orders.filter(order => order.userId === userId);

    res.status(200).json(userOrders);
};

// visualiza detalhes de um pedido específico
exports.getOrderDetails = (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    const order = orders.find(o => o.id === parseInt(id) && o.userId === userId);

    if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado ou você não tem permissão para visualizá-lo." });
    }

    res.status(200).json(order);
};
