const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const EquipmentReview = require('../models/EquipmentReview');
const { isAdmin } = require('../middleware/admin');
const auth = require('../middleware/auth');

const imagesDir = path.join(__dirname, '..', '..', '..', 'frontend', 'images');
const fs = require('fs');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Добавление обзора оборудования (только для админа)
router.post(
  '/equipment-reviews',
  auth.auth,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    const { title, shortDescription, fullText, date, comparisonTable, faq } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required.' });
    if (!title || !shortDescription || !fullText || !date)
      return res.status(400).json({ message: 'All fields are required.' });

    const imagePath = req.file.filename.startsWith('images/')
      ? req.file.filename
      : `images/${req.file.filename}`;

    const review = new EquipmentReview({
      title,
      shortDescription,
      fullText,
      date,
      image: imagePath,
      comparisonTable: comparisonTable ? JSON.parse(comparisonTable) : [],
      faq: faq ? JSON.parse(faq) : []
    });

    await review.save();
    res.status(201).json(review);
  }
);

// Получение всех обзоров
router.get('/equipment-reviews', async (req, res) => {
  const reviews = await EquipmentReview.find().sort({ date: -1 });
  res.json(reviews);
});

// Получение одного обзора по id
router.get('/equipment-reviews/:id', async (req, res) => {
  try {
    const review = await EquipmentReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (e) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// Публичный GET-роут для обзоров оборудования
router.get('/', async (req, res) => {
  const reviews = await EquipmentReview.find().sort({ date: -1 });
  res.json(reviews);
});

module.exports = router; 