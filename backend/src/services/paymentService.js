const axios = require('axios');
const { Order, PaymentStatusHistory } = require('../models/Order');

class PaymentService {
    constructor() {
        // Конфигурация Тинькофф Банка
        this.apiKey = process.env.TINKOFF_API_KEY;
        this.apiUrl = process.env.TINKOFF_API_URL || 'https://securepay.tinkoff.ru/v2';
        this.terminalKey = process.env.TINKOFF_TERMINAL_KEY;
    }

    async createPayment(order) {
        try {
            // Подготовка данных для Тинькофф
            const paymentData = {
                TerminalKey: this.terminalKey,
                Amount: order.totalAmount * 100, // Конвертация в копейки
                OrderId: order._id.toString(),
                Description: `Заказ #${order._id}`,
                SuccessURL: `${process.env.FRONTEND_URL}/payment/success`,
                FailURL: `${process.env.FRONTEND_URL}/payment/fail`,
                NotificationURL: `${process.env.BACKEND_URL}/api/orders/webhook`,
                DATA: {
                    Email: order.user.email,
                    Phone: order.user.phone
                }
            };

            // Создание платежа в Тинькофф
            const response = await axios.post(
                `${this.apiUrl}/Init`,
                paymentData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.Success) {
                // Обновление заказа
                order.paymentId = response.data.PaymentId;
                order.paymentUrl = response.data.PaymentURL;
                order.status = 'PENDING';
                await order.save();

                // Запись в историю статусов
                await PaymentStatusHistory.create({
                    order: order._id,
                    status: 'PENDING',
                    metadata: {
                        paymentId: response.data.PaymentId,
                        paymentUrl: response.data.PaymentURL
                    }
                });

                return {
                    paymentUrl: response.data.PaymentURL,
                    paymentId: response.data.PaymentId
                };
            } else {
                throw new Error(response.data.Message || 'Ошибка создания платежа');
            }
        } catch (error) {
            console.error('Payment creation error:', error);
            throw new Error('Failed to create payment');
        }
    }

    async handleWebhook(req, res) {
        try {
            const { PaymentId, Status, Success } = req.body;

            if (!PaymentId || !Status) {
                return res.status(400).json({ message: 'Invalid webhook data' });
            }

            const order = await Order.findOne({ paymentId: PaymentId });
            if (!order) {
                throw new Error('Order not found');
            }

            // Определение нового статуса
            let newStatus;
            switch (Status) {
                case 'CONFIRMED':
                    newStatus = 'PAID';
                    break;
                case 'REJECTED':
                    newStatus = 'FAILED';
                    break;
                case 'REFUNDED':
                    newStatus = 'REFUNDED';
                    break;
                default:
                    newStatus = order.status;
            }

            // Обновление статуса заказа
            order.status = newStatus;
            await order.save();

            // Запись в историю статусов
            await PaymentStatusHistory.create({
                order: order._id,
                status: newStatus,
                metadata: {
                    paymentId: PaymentId,
                    success: Success,
                    originalStatus: Status
                }
            });

            return order;
        } catch (error) {
            console.error('Webhook processing error:', error);
            throw new Error('Failed to process webhook');
        }
    }

    async retryPayment(order) {
        try {
            if (order.retryCount >= order.maxRetries) {
                order.status = 'FAILED';
                order.lastError = 'Превышено максимальное количество попыток';
                await order.save();
                return false;
            }

            order.retryCount += 1;
            order.status = 'RETRY_PENDING';
            await order.save();

            // Запись в историю статусов
            await PaymentStatusHistory.create({
                order: order._id,
                status: 'RETRY_PENDING',
                metadata: {
                    retryCount: order.retryCount
                }
            });

            // Повторная попытка создания платежа
            return await this.createPayment(order);
        } catch (error) {
            console.error('Payment retry error:', error);
            order.lastError = error.message;
            await order.save();
            return false;
        }
    }

    async getPaymentStatus(paymentId) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/GetState`,
                {
                    TerminalKey: this.terminalKey,
                    PaymentId: paymentId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Get payment status error:', error);
            throw new Error('Failed to get payment status');
        }
    }
}

module.exports = new PaymentService(); 