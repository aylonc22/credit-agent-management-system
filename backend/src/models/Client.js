const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  credit: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // Reference to Agent
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
