const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');

// Регистрация нового пользователя
exports.register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Генерируем токен верификации
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

        // Создаем нового пользователя
        const user = new User({
            email,
            password,
            name,
            phone,
            verificationToken,
            verificationTokenExpires
        });

        await user.save();

        // Отправляем письмо с подтверждением
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ 
            message: 'Пользователь успешно зарегистрирован. Пожалуйста, проверьте вашу почту для подтверждения email.' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
    }
};

// Подтверждение email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Недействительный или истекший токен подтверждения' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Email успешно подтвержден' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Ошибка при подтверждении email' });
    }
};

// Вход пользователя
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Находим пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Проверяем пароль
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Проверяем, подтвержден ли email
        if (!user.isVerified) {
            return res.status(401).json({ 
                message: 'Пожалуйста, подтвердите ваш email перед входом',
                needsVerification: true
            });
        }

        // Создаем JWT токен
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
};

// Повторная отправка письма с подтверждением
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email уже подтвержден' });
        }

        // Генерируем новый токен
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        // Отправляем новое письмо
        await sendVerificationEmail(email, verificationToken);

        res.json({ message: 'Письмо с подтверждением отправлено повторно' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Ошибка при повторной отправке письма с подтверждением' });
    }
}; 