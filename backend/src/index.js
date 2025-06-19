const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');

require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://lending-frontend-s132.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
];
app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (например, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Preflight для всех маршрутов
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(compression());
app.use(helmet());

// Создаем директорию для загрузки файлов, если она не существует
// const uploadDirProducts = path.join(__dirname, '..' , 'uploads', 'products');
// console.log(`Attempting to create product upload directory: ${uploadDirProducts}`);
// try {
//     if (!fs.existsSync(uploadDirProducts)) {
//         fs.mkdirSync(uploadDirProducts, { recursive: true });
//         console.log(`Product upload directory created: ${uploadDirProducts}`);
//     }
// } catch (error) {
//     console.error(`Error creating product upload directory: ${error.message}`);
// }

// const uploadDirCategories = path.join(__dirname, '..' , 'uploads', 'categories');
// console.log(`Attempting to create category upload directory: ${uploadDirCategories}`);
// try {
//     if (!fs.existsSync(uploadDirCategories)) {
//         fs.mkdirSync(uploadDirCategories, { recursive: true });
//         console.log(`Category upload directory created: ${uploadDirCategories}`);
//     }
// } catch (error) {
//     console.error(`Error creating category upload directory: ${error.message}`);
// }

// Правильный путь для статического обслуживания изображений
const imagesPath = path.join(__dirname, '..', '..', 'frontend', 'images');

app.use((req, res, next) => {
  if (req.path.startsWith('/images/')) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  }
  next();
});
app.use('/images', express.static(imagesPath));

// Экспортируем пути загрузки для использования в маршрутах
// exports.uploadDirProducts = uploadDirProducts;
// exports.uploadDirCategories = uploadDirCategories;

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin/categories', require('./routes/categoryRoutes'));
app.use('/api/categories', require('./routes/categoryPublicRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lending', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    // console.log('MongoDB connected');
})
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    // console.log(`Server is running on http://0.0.0.0:${PORT}`);
});