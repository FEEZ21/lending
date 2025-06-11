const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth'); // Use correct exported names
const adminMiddleware = require('../middleware/admin'); // Corrected path
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file deletion

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/Work/lending/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// @desc    Add new category
// @route   POST /api/admin/categories
// @access  Admin
router.post(
    '/',
    auth,
    adminAuth,
    // Removed adminMiddleware.canManageProducts as adminAuth already handles this
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ message: err.message });
            }
            // Everything went fine.
            next();
        });
    },
    async (req, res) => {
        const { name } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({ message: 'Name and image are required.' });
        }

        try {
            const categoryExists = await Category.findOne({ name });

            if (categoryExists) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'Category already exists.' });
            }

            const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes for URL compatibility

            const category = new Category({
                name,
                image: imagePath // Store the path to the image
            });

            const createdCategory = await category.save();

            res.status(201).json(createdCategory);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router; 