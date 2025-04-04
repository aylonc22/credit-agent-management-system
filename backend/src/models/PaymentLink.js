const mongoose = require('mongoose');

const paymentLinkSchema = new mongoose.Schema({
  linkId: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  paymentLink: { type: String, required: true },  // Example: 'https://mysite.com/payment?id=12345&amount=100'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);

module.exports = PaymentLink;
