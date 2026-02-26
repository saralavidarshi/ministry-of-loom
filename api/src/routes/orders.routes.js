const router = require("express").Router();
const { createOrder, getMyOrders } = require("../controllers/orders.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.post("/orders", authenticate, createOrder);
router.get("/orders/me", authenticate, getMyOrders);


module.exports = router;
