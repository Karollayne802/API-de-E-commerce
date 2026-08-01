const express = require("express");
const { body } = require("express-validator");
const reviewController = require("../controllers/reviewController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// criar avaliação 
router.post(
    "/:productId/reviews",
    requireAuth,
    [
        body("nota").isInt({ min: 1, max: 5 }).withMessage("A nota deve ser entre 1 e 5."),
        body("comentario").optional().isLength({ max: 500 }).withMessage("O comentário não pode exceder 500 caracteres."),
    ],
    validate,
    reviewController.addReview
);

router.get("/:productId/reviews", reviewController.listProductReviews);

module.exports = router;
