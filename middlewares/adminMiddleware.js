const requireAdmin = (req, res, next) => {
    // Primeiro, verifica se o usuário está autenticado
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Não autorizado. Faça login para acessar este recurso." });
    }

    // Em um cenário real, você buscaria o usuário no banco de dados para verificar isAdmin
    // Por enquanto, vamos simular isso usando os dados mockados
    const { users } = require("../utils/mockData");
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Acesso proibido. Apenas administradores podem acessar este recurso." });
    }

    next(); // Se for administrador, continua
};

module.exports = requireAdmin;
