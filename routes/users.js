const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// cadastro
router.post(
    "/register",
    [
        body("nome").notEmpty().withMessage("O nome é obrigatório."),
        body("email").isEmail().withMessage("E-mail inválido."),
        body("senha").isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres."),
        body("endereco").notEmpty().withMessage("O endereço é obrigatório."),
    ],
    validate,
    userController.registerUser
);

// login 
router.post("/login", userController.loginUser);
router.post("/logout", requireAuth, userController.logoutUser);

// perfil 
router.get("/profile", requireAuth, userController.getUserProfile);
router.put(
    "/profile",
    requireAuth,
    [
        body("nome").optional().notEmpty().withMessage("O nome não pode ser vazio."),
        body("email").optional().isEmail().withMessage("E-mail inválido."),
        body("endereco").optional().notEmpty().withMessage("O endereço não pode ser vazio."),
    ],
    validate,
    userController.updateUserProfile
);

module.exports = router;
