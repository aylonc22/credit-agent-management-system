const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({ 
  name: { type: String, required: true },  
  email: { type: String, required: true }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
