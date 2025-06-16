const { adminAuth } = require('./auth');

exports.isAdmin = adminAuth;
exports.canManageProducts = adminAuth;
exports.canManageUsers = adminAuth;
exports.canManageOrders = adminAuth;
exports.canManageContent = adminAuth; 