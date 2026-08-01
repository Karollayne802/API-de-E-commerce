const { users } = require("../utils/mockData");
const bcrypt = require("bcryptjs");

// cadastro de novo usuário
exports.registerUser = async (req, res) => {
    const { nome, email, senha, endereco } = req.body;

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        nome,
        email,
        senhaHash: hashedPassword,
        endereco,
        isAdmin: false,
    };
    users.push(newUser);

    // tira o hash da resposta
    const { senhaHash, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: "Usuário registrado com sucesso!", user: userWithoutPassword });
};

// login: salva o userId na sessão
exports.loginUser = async (req, res) => {
    const { email, senha } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await bcrypt.compare(senha, user.senhaHash);
    if (!isMatch) {
        return res.status(400).json({ message: "Credenciais inválidas." });
    }

    req.session.userId = user.id;

    const { senhaHash, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Login realizado com sucesso!", user: userWithoutPassword });
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao fazer logout." });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout realizado com sucesso!" });
    });
};

exports.getUserProfile = (req, res) => {
    const user = users.find(u => u.id === req.session.userId);
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }
    const { senhaHash, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
};

// só atualiza os campos que vieram
exports.updateUserProfile = (req, res) => {
    const { nome, email, endereco } = req.body;
    const userIndex = users.findIndex(u => u.id === req.session.userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    users[userIndex].nome = nome || users[userIndex].nome;
    users[userIndex].email = email || users[userIndex].email;
    users[userIndex].endereco = endereco || users[userIndex].endereco;

    const { senhaHash, ...updatedUser } = users[userIndex];
    res.status(200).json({ message: "Perfil atualizado com sucesso!", user: updatedUser });
};
