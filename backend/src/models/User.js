const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'client','agent','master-agent'], required: true }, 
  passwordChangedAt: { type: Date, default: Date.now },
  twoFA: {
    enabled: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    code: {type:String },
    expiresAt: {type:Date }

  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
