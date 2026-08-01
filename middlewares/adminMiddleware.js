const requireAdmin = (req, res, next) => {
    // primeiro garante que o usuário tá logado
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Não autorizado. Faça login para acessar este recurso." });
    }

    const { users } = require("../utils/mockData");
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Acesso proibido. Apenas administradores podem acessar este recurso." });
    }

    next();
};

module.exports = requireAdmin;
