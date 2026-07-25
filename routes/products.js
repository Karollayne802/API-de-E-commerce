const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/productController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Rota para listar produtos com filtros
router.get("/", productController.listProducts);

// Rota para buscar produto por ID
router.get("/:id", productController.getProductById);

// Rota para criar um novo produto (requer autenticação e admin)
router.post(
    "/",
    requireAuth,
    requireAdmin,
    [
        body("nome").notEmpty().withMessage("O nome do produto é obrigatório."),
        body("descricao").notEmpty().withMessage("A descrição é obrigatória."),
        body("preco").isFloat({ gt: 0 }).withMessage("O preço deve ser um número positivo."),
        body("categoria").notEmpty().withMessage("A categoria é obrigatória."),
        body("estoque").isInt({ gt: -1 }).withMessage("O estoque deve ser um número inteiro não negativo."),
    ],
    validate,
    productController.createProduct
);

// Rota para editar um produto existente (requer autenticação e admin)
router.put(
    "/:id",
    requireAuth,
    requireAdmin,
    [
        body("nome").optional().notEmpty().withMessage("O nome do produto não pode ser vazio."),
        body("descricao").optional().notEmpty().withMessage("A descrição não pode ser vazia."),
        body("preco").optional().isFloat({ gt: 0 }).withMessage("O preço deve ser um número positivo."),
        body("categoria").optional().notEmpty().withMessage("A categoria não pode ser vazia."),
        body("estoque").optional().isInt({ gt: -1 }).withMessage("O estoque deve ser um número inteiro não negativo."),
    ],
    validate,
    productController.updateProduct
);

// Rota para remover um produto (requer autenticação e admin)
router.delete("/:id", requireAuth, requireAdmin, productController.deleteProduct);

module.exports = router;
