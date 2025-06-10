const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Подтверждение email
router.get('/verify-email', authController.verifyEmail);

// Повторная отправка письма с подтверждением
router.post('/resend-verification', authController.resendVerification);

module.exports = router; 