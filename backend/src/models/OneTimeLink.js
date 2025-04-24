// models/OneTimeLink.js
const mongoose = require('mongoose');

const oneTimeLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin','agent','master-agent','password-reset','payment']},
  used: { type: Boolean, default: false },
  clicked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  metadata: {type: String},
});

module.exports = mongoose.model('OneTimeLink', oneTimeLinkSchema);
