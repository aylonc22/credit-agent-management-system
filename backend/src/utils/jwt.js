const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN_CLIENT = process.env.JWT_EXPIRES_IN_CLIENT || '15m';
const JWT_EXPIRES_IN_AGENT = process.env.JWT_EXPIRES_IN_AGENT || '45m';
const JWT_EXPIRES_IN_ADMIN = process.env.JWT_EXPIRES_IN_ADMIN || '2h';

/**
 * Sign a new JWT token
 * @param {Object} payload - Data to encode into the token
 * @returns {string} - JWT token
 */
const generateToken = async (payload) => {
  let JWT_EXPIRES_IN;
  let agent;
  switch (payload.role) {
    case 'client':
      JWT_EXPIRES_IN = JWT_EXPIRES_IN_CLIENT;
      break;
    case 'admin':
      JWT_EXPIRES_IN = JWT_EXPIRES_IN_ADMIN;
      break;
    case 'agent':
      JWT_EXPIRES_IN = JWT_EXPIRES_IN_AGENT;
      agent = await Agent.findOne({userId: payload.id});
      payload.agentId = agent._id;
      break;
    case 'master-agent':
      JWT_EXPIRES_IN = JWT_EXPIRES_IN_AGENT;
      agent = await Agent.findOne({userId: payload.id});
      payload.agentId = agent._id;
      break;
    default:
      JWT_EXPIRES_IN = JWT_EXPIRES_IN_CLIENT;
      break;
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode a token without verifying signature (optional use)
 * @param {string} token
 * @returns {Object}
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
