const express = require("express");
const { body } = require("express-validator");
const cartController = require("../controllers/cartController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// Todas as rotas de carrinho requerem autenticação
router.use(requireAuth);

// Adicionar item ao carrinho
router.post(
    "/",
    [
        body("productId").isInt({ gt: 0 }).withMessage("ID do produto inválido."),
        body("quantity").isInt({ gt: 0 }).withMessage("A quantidade deve ser um número positivo."),
    ],
    validate,
    cartController.addItemToCart
);

// Remover item do carrinho
router.delete("/:productId", cartController.removeItemFromCart);

// Atualizar quantidade de um item no carrinho
router.put(
    "/:productId",
    [
        body("quantity").isInt({ gt: 0 }).withMessage("A quantidade deve ser um número positivo."),
    ],
    validate,
    cartController.updateCartItemQuantity
);

// Visualizar carrinho atual
router.get("/", cartController.viewCart);

module.exports = router;
