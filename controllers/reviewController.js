const { reviews, products } = require("../utils/mockData");

// Função para usuários autenticados avaliarem produtos
exports.addReview = (req, res) => {
    const { productId, nota, comentario } = req.body;
    const userId = req.session.userId;

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Verifica se o usuário já avaliou este produto
    const existingReview = reviews.find(r => r.userId === userId && r.productId === parseInt(productId));
    if (existingReview) {
        return res.status(400).json({ message: "Você já avaliou este produto." });
    }

    const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        productId: parseInt(productId),
        userId,
        nota: parseInt(nota),
        comentario,
        data: new Date().toISOString(),
    };
    reviews.push(newReview);

    res.status(201).json({ message: "Avaliação adicionada com sucesso!", review: newReview });
};

// Função para listar avaliações de um produto
exports.listProductReviews = (req, res) => {
    const { productId } = req.params;
    const productReviews = reviews.filter(review => review.productId === parseInt(productId));

    res.status(200).json(productReviews);
};
