const express = require("express");
const router = express.Router();

const { listOrders, updateOrderStatus } = require("../controllers/adminOrders.controller"); 
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/admin/orders", authenticate, authorize("admin"), listOrders);
router.patch("/admin/orders/:id/status", authenticate, authorize("admin"), updateOrderStatus);

module.exports = router;