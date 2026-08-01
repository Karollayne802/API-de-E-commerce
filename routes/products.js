const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/productController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// listagem e detalhe são públicos
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);

// só admin
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

router.delete("/:id", requireAuth, requireAdmin, productController.deleteProduct);

module.exports = router;
