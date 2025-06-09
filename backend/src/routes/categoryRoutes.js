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
            console.log('Inside upload.single callback.');
            console.log('req.file object:', req.file);
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.error('Multer Error:', err);
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.error('Unknown Upload Error:', err);
                return res.status(500).json({ message: err.message });
            }
            // Everything went fine.
            next();
        });
    },
    async (req, res) => {
        const { name } = req.body;
        const image = req.file ? `images/${req.file.filename}` : null;

        // Basic validation
        if (!name || !image) {
            console.log('Validation failed: Missing name or image');
            // If there was a file uploaded before this validation failed, clean it up
            if (req.file) {
                 fs.unlink(req.file.path, (err) => {
                     if (err) console.error('Error deleting partially uploaded image:', err);
                 });
            }
            return res.status(400).json({ message: 'Please enter category name and upload an image' });
        }

        try {
            console.log(`Attempting to find category with name: ${name}`);
            const categoryExists = await Category.findOne({ name });
            console.log('Category find result:', categoryExists);

            if (categoryExists) {
                console.log(`Category with name ${name} already exists`);
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Error deleting duplicate category image:', err);
                    });
                }
                return res.status(400).json({ message: 'Category with this name already exists' });
            }

            console.log('Creating new Category instance');
            const category = new Category({
                name,
                image
            });
            console.log('New Category instance created:', category);

            console.log('Attempting to save new category');
            const createdCategory = await category.save();
            console.log('Category saved successfully:', createdCategory);

            console.log('Sending 201 response');
            res.status(201).json(createdCategory);

        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router; 