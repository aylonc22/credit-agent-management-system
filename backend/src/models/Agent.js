const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({ 
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: { type: String, required: true },  
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
