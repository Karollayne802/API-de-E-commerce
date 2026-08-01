const express = require("express");
const { body } = require("express-validator");
const cartController = require("../controllers/cartController");
const validate = require("../middlewares/validationMiddleware");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.post(
    "/items",
    [
        body("productId").isInt({ gt: 0 }).withMessage("ID do produto inválido."),
        body("quantity").isInt({ gt: 0 }).withMessage("A quantidade deve ser um número positivo."),
    ],
    validate,
    cartController.addItemToCart
);

router.delete("/items/:productId", cartController.removeItemFromCart);

router.put(
    "/items/:productId",
    [
        body("quantity").isInt({ gt: 0 }).withMessage("A quantidade deve ser um número positivo."),
    ],
    validate,
    cartController.updateCartItemQuantity
);

router.get("/", cartController.viewCart);

module.exports = router;
