const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent'},
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  amount_paid: { type: Number, default:0 },
  merchantOrderNo: { type: String },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  notes: { type:String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
