const express = require("express");
const { body } = require("express-validator");
const reviewController = require("../controllers/reviewController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota para adicionar uma avaliação (requer autenticação)
router.post(
    "/",
    requireAuth,
    [
        body("productId").isInt({ gt: 0 }).withMessage("ID do produto inválido."),
        body("nota").isInt({ min: 1, max: 5 }).withMessage("A nota deve ser entre 1 e 5."),
        body("comentario").optional().isLength({ max: 500 }).withMessage("O comentário não pode exceder 500 caracteres."),
    ],
    validate,
    reviewController.addReview
);

// Rota para listar avaliações de um produto
router.get("/:productId", reviewController.listProductReviews);

module.exports = router;
