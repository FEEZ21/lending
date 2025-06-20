const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { Order } = require('../models/Order');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create review
router.post('/', auth, [
    body('productId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').notEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { productId, rating, comment } = req.body;

        // Проверка: покупал ли пользователь этот продукт
        const hasBought = await Order.exists({
            user: req.user._id,
            status: 'PAID',
            'products.product': productId
        });
        if (!hasBought) {
            return res.status(403).json({ message: 'Вы можете оставить отзыв только на купленный товар.' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this product' 
            });
        }

        const review = new Review({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });

        await review.save();
        await review.populate('user', 'name');
        
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update review
router.put('/:id', auth, [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').notEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;
        
        await review.save();
        await review.populate('user', 'name');
        
        res.json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.remove();
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all reviews (for main page)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'name')
            .populate('product', 'name')
            .sort('-createdAt')
            .limit(20);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 