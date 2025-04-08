const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  credit: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // Reference to Agent
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
