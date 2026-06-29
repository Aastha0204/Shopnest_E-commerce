const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
} = require("../controller/orderController");

const router = express.Router();

// Create Order
router.post("/", protect, createOrder);

// Get Logged-in User Orders
router.get("/myorders", protect, myOrders);

// Get All Orders (Admin Only)
router.get("/", protect, admin, getOrders);

// Update Order Status (Admin Only)
router.put("/:orderId", protect, admin, updateOrderStatus);

module.exports = router;