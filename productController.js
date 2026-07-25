const { products } = require("../utils/mockData");

// Função para listar produtos com filtros
exports.listProducts = (req, res) => {
    const { category, minPrice, maxPrice, name } = req.query;
    let filteredProducts = [...products];

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.categoria.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.preco >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.preco <= parseFloat(maxPrice));
    }
    if (name) {
        filteredProducts = filteredProducts.filter(p => p.nome.toLowerCase().includes(name.toLowerCase()));
    }

    res.status(200).json(filteredProducts);
};

// Função para buscar produto por ID
exports.getProductById = (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.status(200).json(product);
};

// Função para criar um novo produto (apenas administradores)
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

// Função para editar um produto existente (apenas administradores)
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

// Função para remover um produto (apenas administradores)
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const initialLength = products.length;
    products = products.filter(p => p.id !== parseInt(id));

    if (products.length === initialLength) {
        return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json({ message: "Produto removido com sucesso!" });
};
