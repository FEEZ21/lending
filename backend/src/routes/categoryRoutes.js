const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth'); // Use correct exported names
const adminMiddleware = require('../middleware/admin'); // Corrected path
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file deletion
// const { uploadDirCategories } = require('../index'); // Import the absolute upload path

const imagesDir = path.join(__dirname, '..', '..', '..', 'frontend', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('Created images directory:', imagesDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
                console.log('Created images directory (on upload):', imagesDir);
            }
            cb(null, imagesDir);
        } catch (err) {
            console.error('Error creating images directory:', err);
            cb(err);
        }
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
    // Temporarily removed auth and adminAuth for debugging
    (req, res, next) => {
        console.log("Entered POST /api/admin/categories route.");
        console.log("Before Multer upload. Request body:", req.body);
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.error("Multer Error:", err);
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.error("Unknown Upload Error:", err);
                return res.status(500).json({ message: err.message });
            }
            console.log("Multer upload complete. req.file:", req.file);
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
                // If category exists, delete the uploaded file before returning error
                // fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'Category already exists.' });
            }

            let imagePath = req.file.filename;
            if (!imagePath.startsWith('images/')) {
                imagePath = `images/${imagePath}`;
            }
            console.log("Saving image path to DB:", imagePath);

            const category = new Category({
                name,
                image: imagePath
            });

            const createdCategory = await category.save();

            res.status(201).json(createdCategory);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router; 