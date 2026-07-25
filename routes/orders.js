const express = require("express");
const orderController = require("../controllers/orderController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

// Todas as rotas de pedidos requerem autenticação
router.use(requireAuth);

// Finalizar compra
router.post("/checkout", orderController.checkout);

// Listar histórico de pedidos do usuário
router.get("/", orderController.listUserOrders);

// Visualizar detalhes de um pedido específico
router.get("/:id", orderController.getOrderDetails);

module.exports = router;
