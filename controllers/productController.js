const { products } = require("../utils/mockData");

// listagem com filtros de categoria, preço e busca
exports.listProducts = (req, res) => {
    const { category, minPrice, maxPrice, search, name } = req.query;
    let filteredProducts = [...products];

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.preco >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.preco <= parseFloat(maxPrice));
    }
    const searchTerm = search || name;
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.nome && p.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // converte o preço pela moeda que veio no cookie de preferências
    const preferences = req.cookies.preferences || {};
    const currency = preferences.currency || "USD";
    const rates = { USD: 1, EUR: 0.85, BRL: 5 };
    const rate = rates[currency] || 1;

    const result = filteredProducts.map(p => ({
        ...p,
        preco: parseFloat((p.preco * rate).toFixed(2)),
        currency,
    }));

    res.status(200).json(result);
};

exports.getProductById = (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.status(200).json(product);
};

// a rota já garante que só admin chega aqui
exports.createProduct = (req, res) => {
    const { nome, descricao, preco, categoria, estoque } = req.body;

    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        nome,
        descricao,
        preco,
        categoria,
        estoque,
    };
    products.push(newProduct);

    res.status(201).json({ message: "Produto criado com sucesso!", product: newProduct });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, estoque } = req.body;
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }

    products[productIndex] = {
        ...products[productIndex],
        nome: nome || products[productIndex].nome,
        descricao: descricao || products[productIndex].descricao,
        preco: preco || products[productIndex].preco,
        categoria: categoria || products[productIndex].categoria,
        estoque: estoque || products[productIndex].estoque,
    };

    res.status(200).json({ message: "Produto atualizado com sucesso!", product: products[productIndex] });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex > -1) {
        products.splice(productIndex, 1);
        res.status(200).json({ message: "Produto removido com sucesso!" });
    } else {
        res.status(404).json({ message: "Produto não encontrado." });
    }
};
