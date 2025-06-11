const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

// Регистрация пользователя
router.post('/register', [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    body('phone').optional().trim(),
    body('address').optional(),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid user role')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phone, address, role } = req.body;

        // Проверяем, существует ли пользователь
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Создаем токен верификации
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Создаем нового пользователя, передавая role, если она была указана
        user = new User({
            name,
            email,
            password,
            phone,
            address,
            role,
            verificationToken
        });

        await user.save();

        // Создаем JWT токен
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: user.getPublicProfile()
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Вход пользователя
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Находим пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверяем пароль
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Обновляем время последнего входа
        user.lastLogin = new Date();
        await user.save();

        // Создаем JWT токен
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: user.getPublicProfile()
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить текущего пользователя
router.get('/me', auth, async (req, res) => {
    try {
        res.json(req.user.getPublicProfile());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Обновить профиль пользователя
router.put('/profile', auth, [
    body('name').optional().trim(),
    body('phone').optional().trim(),
    body('address').optional()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'phone', 'address'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        res.json(req.user.getPublicProfile());
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Изменить пароль
router.put('/change-password', auth, [
    body('currentPassword').exists(),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        // Проверяем текущий пароль
        const isMatch = await req.user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Обновляем пароль
        req.user.password = newPassword;
        await req.user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Запрос на сброс пароля
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Генерируем токен для сброса пароля
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 час
        await user.save();

        // TODO: Отправить email с токеном для сброса пароля
        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Сброс пароля
router.post('/reset-password', [
    body('token').exists(),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: req.body.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = req.body.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Подтверждение почты
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is missing.' });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined; // Clear expiration date
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 