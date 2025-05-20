const rateLimit = require("express-rate-limit");

// Setup rate limiter
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests. Please try again later.',
  },
});

module.exports = defaultLimiter;