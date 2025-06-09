const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Product = require('../models/Product');
const adminMiddleware = require('../middleware/admin');
const { body, validationResult } = require('express-validator');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:/Work/lending/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Получить все продукты (с пагинацией и фильтрацией)
router.get('/products', adminMiddleware.canManageProducts, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const category = req.query.category || '';

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category;
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Создать новый продукт
router.post('/products', 
    adminMiddleware.canManageProducts,
    upload.single('image'),
    [
        body('name').notEmpty().trim(),
        body('description').notEmpty(),
        body('price').isNumeric().isFloat({ min: 0 }),
        body('category').notEmpty(),
    ],
    async (req, res) => {
        console.log('Received request to add product.');
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error("Error deleting temp file:", err));
            }
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, description, price, category } = req.body;
            const imagePath = req.file ? `images/${req.file.filename}` : null;

            if (!imagePath) {
                return res.status(400).json({ message: 'Изображение обязательно.' });
            }

            const product = new Product({
                name, 
                description,
                price,
                category,
                image: imagePath,
            });

            await product.save();
            res.status(201).json({ message: 'Товар успешно добавлен!', product });
        } catch (err) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error("Error deleting temp file on save error:", err));
            }
            res.status(400).json({ message: err.message });
        }
    }
);

// Обновить продукт
router.put('/products/:id',
    adminMiddleware.canManageProducts,
    upload.single('image'),
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (req.file) {
                if (product.image) {
                    await fs.unlink(`D:/Work/lending/${product.image}`).catch(() => {});
                }
                product.image = `images/${req.file.filename}`;
            }

            Object.assign(product, req.body);
            await product.save();
            res.json(product);
        } catch (err) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            res.status(400).json({ message: err.message });
        }
    }
);

// Удалить продукт
router.delete('/products/:id', adminMiddleware.canManageProducts, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.image) {
            await fs.unlink(`D:/Work/lending/${product.image}`).catch(() => {});
        }

        await product.remove();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Удалить изображение продукта
router.delete('/products/:id/images/:imageIndex',
    adminMiddleware.canManageProducts,
    async (req, res) => {
        return res.status(400).json({ message: 'Этот маршрут не поддерживается для продуктов с одним изображением.' });
    }
);

// Получить статистику
router.get('/dashboard', adminMiddleware.isAdmin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 