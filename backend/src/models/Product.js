const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: false
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    category: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    newArrival: {
        type: Boolean,
        default: false
    },
    specifications: {
        type: Map,
        of: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    images: {
        type: [String],
        required: false
    }
}, {
    timestamps: true
});

// Индексы для поиска
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema); 