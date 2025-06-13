const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Get all products
router.get('/', async (req, res) => {
    try {
        const query = {};
        const sort = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by featured products
        if (req.query.featured === 'true') {
            query.featured = true;
        }

        // Filter by new arrivals
        if (req.query.newArrival === 'true') {
            query.newArrival = true;
        }

        // Sorting logic for "New Arrivals"
        if (req.query.sortBy) {
            sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
        }

        const products = await Product.find(query).sort(sort);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create product
router.post('/', [
    body('name').notEmpty().trim(),
    body('description').notEmpty(),
    body('price').isNumeric().isFloat({ min: 0 }),
    body('category').notEmpty(),
    body('image').notEmpty(),
    body('stock').isInt({ min: 0 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 