const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create order
router.post('/', orderController.createOrder);

// Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// Get order by number
router.get('/track/:orderNumber', orderController.getOrderByNumber);

// Update order status (admin)
router.put('/:orderId/status', orderController.updateOrderStatus);

// Cancel order
router.put('/:orderId/cancel', orderController.cancelOrder);

// Get all orders (admin)
router.get('/admin/all', orderController.getAllOrders);

module.exports = router;
