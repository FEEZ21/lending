const nodemailer = require('nodemailer');

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Функция для отправки письма с подтверждением
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Подтверждение email адреса',
        html: `
            <h1>Подтверждение email адреса</h1>
            <p>Пожалуйста, подтвердите ваш email адрес, перейдя по следующей ссылке:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
}; 