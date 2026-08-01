const express = require("express");
const orderController = require("../controllers/orderController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// pedidos sempre exigem login
router.use(requireAuth);

router.post("/checkout", orderController.checkout);
router.get("/", orderController.listUserOrders);
router.get("/:id", orderController.getOrderDetails);

module.exports = router;
