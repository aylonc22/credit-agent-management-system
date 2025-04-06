// server/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  logo: { type: String, required: false },
  backgroundImage: { type: String, required: false },
  welcomeMessage: { type: String, default: '' },
  termsOfUse: { type: String, default: '' },
  passwordExpiryDays: { type: Number, default: 90 }
});

module.exports = mongoose.model('Settings', settingsSchema);
