const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Não autorizado. Faça login para acessar este recurso." });
    }
    next(); // Se autenticado, continua para a próxima função middleware/rota
};

module.exports = requireAuth;
