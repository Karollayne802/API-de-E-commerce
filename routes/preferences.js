const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validationMiddleware");

const router = express.Router();

// salva as preferências num cookie 
router.post(
    "/",
    [
        body("theme").optional().isIn(["light", "dark"]).withMessage("O tema deve ser 'light' ou 'dark'."),
        body("currency").optional().isIn(["USD", "BRL", "EUR"]).withMessage("A moeda deve ser USD, BRL ou EUR."),
    ],
    validate,
    (req, res) => {
        const { theme, currency } = req.body;
        const preferences = {
            theme: theme || "light",
            currency: currency || "USD",
        };
        res.cookie("preferences", preferences, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: false,
        });
        res.status(200).json({ message: "Preferências salvas com sucesso!", preferences });
    }
);

module.exports = router;
