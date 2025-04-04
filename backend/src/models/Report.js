const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['weekly', 'monthly'], required: true },
  generatedFor: { type: String, enum: ['agent', 'client'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // To store any dynamic report data
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
