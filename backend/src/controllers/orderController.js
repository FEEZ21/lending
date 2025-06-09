const Order = require('../models/Order');
const Product = require('../models/Product');
const paymentService = require('../services/paymentService');

class OrderController {
    async createOrder(req, res) {
        try {
            const { products } = req.body;
            const userId = req.user.id; // From JWT token

            // Validate products array
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: 'Invalid products data' });
            }

            // Get products from database and calculate total
            const productIds = products.map(p => p.productId);
            const dbProducts = await Product.find({ _id: { $in: productIds } });

            if (dbProducts.length !== productIds.length) {
                return res.status(400).json({ message: 'Some products not found' });
            }

            // Create order items with prices
            const orderItems = products.map(item => {
                const product = dbProducts.find(p => p._id.toString() === item.productId);
                return {
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                };
            });

            // Calculate total amount
            const totalAmount = orderItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            // Create order
            const order = new Order({
                user: userId,
                products: orderItems,
                totalAmount
            });

            await order.save();

            // Create payment
            const payment = await paymentService.createPayment(order);

            res.status(201).json({
                message: 'Order created successfully',
                orderId: order._id,
                paymentUrl: payment.paymentUrl
            });
        } catch (error) {
            console.error('Order creation error:', error);
            res.status(500).json({ message: 'Failed to create order' });
        }
    }

    async handlePaymentWebhook(req, res) {
        try {
            const { paymentId, status } = req.body;

            if (!paymentId || !status) {
                return res.status(400).json({ message: 'Invalid webhook data' });
            }

            const order = await paymentService.handleWebhook(paymentId, status);

            res.status(200).json({
                message: 'Webhook processed successfully',
                orderId: order._id,
                status: order.status
            });
        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).json({ message: 'Failed to process webhook' });
        }
    }

    async getOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;

            const order = await Order.findOne({
                _id: orderId,
                user: userId
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({
                orderId: order._id,
                status: order.status,
                totalAmount: order.totalAmount
            });
        } catch (error) {
            console.error('Get order status error:', error);
            res.status(500).json({ message: 'Failed to get order status' });
        }
    }
}

module.exports = new OrderController(); 