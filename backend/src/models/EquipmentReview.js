const mongoose = require('mongoose');

const equipmentReviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullText: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  comparisonTable: { type: Array, default: [] }, // если нужна таблица сравнения
  faq: { type: Array, default: [] } // если нужен FAQ
}, { timestamps: true });

module.exports = mongoose.model('EquipmentReview', equipmentReviewSchema); 