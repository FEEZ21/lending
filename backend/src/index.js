const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
// Re-added global CORS configuration for all API routes
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(compression());
app.use(helmet());

// Создаем директорию для загрузки файлов, если она не существует
const uploadDirProducts = path.join(__dirname, '../../images');
if (!require('fs').existsSync(uploadDirProducts)) {
    require('fs').mkdirSync(uploadDirProducts, { recursive: true });
}

const uploadDirCategories = 'D:/Work/lending/images';
if (!require('fs').existsSync(uploadDirCategories)) {
    require('fs').mkdirSync(uploadDirCategories, { recursive: true });
}

const imagesPath = 'D:/Work/lending/images';

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

// Routes
// API routes will now also be covered by the global CORS middleware above
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