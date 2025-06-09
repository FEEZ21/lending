const { body, param } = require('express-validator');
const { PaymentValidationError } = require('../errors/paymentErrors');

const validateCreateOrder = [
    body('products')
        .isArray()
        .withMessage('Products must be an array')
        .notEmpty()
        .withMessage('Products array cannot be empty'),
    
    body('products.*.productId')
        .isMongoId()
        .withMessage('Invalid product ID'),
    
    body('products.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1')
];

const validateOrderId = [
    param('orderId')
        .isMongoId()
        .withMessage('Invalid order ID')
];

const validateWebhook = [
    body('PaymentId')
        .notEmpty()
        .withMessage('PaymentId is required'),
    
    body('Status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['CONFIRMED', 'REJECTED', 'REFUNDED', 'AUTHORIZED'])
        .withMessage('Invalid payment status')
];

const validateAmount = (amount) => {
    if (typeof amount !== 'number' || amount <= 0) {
        throw new PaymentValidationError('Invalid amount');
    }
    if (amount > 1000000) { // Максимальная сумма 1,000,000 рублей
        throw new PaymentValidationError('Amount exceeds maximum limit');
    }
    return true;
};

module.exports = {
    validateCreateOrder,
    validateOrderId,
    validateWebhook,
    validateAmount
}; 