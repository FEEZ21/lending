const { adminAuth } = require('./auth');

const adminMiddleware = {
    // Middleware для проверки прав администратора
    isAdmin: adminAuth,

    // Middleware для проверки прав на управление продуктами
    canManageProducts: adminAuth,

    // Middleware для проверки прав на управление пользователями
    canManageUsers: adminAuth,

    // Middleware для проверки прав на управление заказами
    canManageOrders: adminAuth,

    // Middleware для проверки прав на управление контентом
    canManageContent: adminAuth
};

module.exports = adminMiddleware; 