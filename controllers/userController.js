const { users } = require("../utils/mockData");
const bcrypt = require("bcryptjs"); 

// registra um novo usuário
exports.registerUser = async (req, res) => {
    const { nome, email, senha, endereco } = req.body;

    // Verifica se o e-mail já existe
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        nome,
        email,
        senhaHash: hashedPassword,
        endereco,
        isAdmin: false, 
    };
    users.push(newUser);

    // Retorna o usuário sem a senha hash
    const { senhaHash, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: "Usuário registrado com sucesso!", user: userWithoutPassword });
};

// Função para login de usuário
exports.loginUser = async (req, res) => {
    const { email, senha } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "Credenciais inválidas." });
    }

    // Compara a senha fornecida com a senha hash
    const isMatch = await bcrypt.compare(senha, user.senhaHash);
    if (!isMatch) {
        return res.status(400).json({ message: "Credenciais inválidas." });
    }

    // Armazena o ID do usuário na sessão
    req.session.userId = user.id;

    // Retorna o usuário sem a senha hash
    const { senhaHash, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Login realizado com sucesso!", user: userWithoutPassword });
};

// Função para logout de usuário
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao fazer logout." });
        }
        res.clearCookie("connect.sid"); 
        res.status(200).json({ message: "Logout realizado com sucesso!" });
    });
};

// Função para obter o perfil do usuário
exports.getUserProfile = (req, res) => {
    const user = users.find(u => u.id === req.session.userId);
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }
    const { senhaHash, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
};

// atualiza o perfil do usuário
exports.updateUserProfile = (req, res) => {
    const { nome, email, endereco } = req.body;
    const userIndex = users.findIndex(u => u.id === req.session.userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Atualiza os dados do usuário
    users[userIndex].nome = nome || users[userIndex].nome;
    users[userIndex].email = email || users[userIndex].email;
    users[userIndex].endereco = endereco || users[userIndex].endereco;

    const { senhaHash, ...updatedUser } = users[userIndex];
    res.status(200).json({ message: "Perfil atualizado com sucesso!", user: updatedUser });
};
