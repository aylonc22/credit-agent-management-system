const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Can be agent or client
  type: { type: String, enum: ['transaction', 'system', 'alert'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
