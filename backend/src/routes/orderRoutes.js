const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const { validateCreateOrder, validateOrderId, validateWebhook } = require('../validators/paymentValidator');
const { validationResult } = require('express-validator');

// Middleware для обработки ошибок валидации
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Create new order and initiate payment
router.post('/create', 
    authMiddleware.auth,
    validateCreateOrder,
    handleValidationErrors,
    orderController.createOrder
);

// Get order status
router.get('/status/:orderId', 
    authMiddleware.auth,
    validateOrderId,
    handleValidationErrors,
    orderController.getOrderStatus
);

// Payment webhook endpoint (no auth required as it's called by payment gateway)
router.post('/webhook', 
    validateWebhook,
    handleValidationErrors,
    orderController.handlePaymentWebhook
);

module.exports = router; 