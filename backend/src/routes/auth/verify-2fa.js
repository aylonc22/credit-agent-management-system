const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../../models/User');
const Settings = require('../../models/Settings');
const { generateToken } = require('../../utils/jwt');

const router = express.Router();

// 🔁 Shared logic for 2FA validation and response
async function handle2FAVerification(user, twofaCode, res) {
  if (!user) {
    return res.status(404).json({ message: "משתמש לא נמצא" });
  }

  if (user.twoFA.code !== twofaCode) {
    return res.status(400).json({ message: "קוד 2FA לא נכון" });
  }

  const now = new Date();
  const expirationTime = user.twoFA.expiresAt;

  if (now > expirationTime) {
    return res.status(410).json({ message: "הקוד פג תוקף" });
  }

  const settings = await Settings.findOne();

  user.twoFA = {
    enabled: true,
    verified: true,
    code: null,
    expiresAt: null,
  };

  await user.save();

  const newToken = await generateToken({
    id: user._id,
    role: user.role,
    twofaEnabled: user.twoFA.enabled,
  });

  res.setHeader('x-access-token', newToken);
  return res.status(200).json({
    message: "הקוד אושר בהצלחה!",
    welcome: settings?.welcomeMessage || '',   
  });
}

// 🔐 Authenticated route
router.post('/protected', authMiddleware, async (req, res) => {
  const { id } = req.user;
  const { twofaCode } = req.body;

  if (!id || !twofaCode) {
    return res.status(400).json({ message: "חסרים פרמטרים" });
  }

  try {
    const user = await User.findById(id);
    return await handle2FAVerification(user, twofaCode, res);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "משהו השתבש" });
  }
});

// 🔓 Public route
router.post('/', async (req, res) => {
  const { username, twofaCode } = req.body;

  if (!username || !twofaCode) {
    return res.status(400).json({ message: "חסרים פרמטרים" });
  }

  try {
    const user = await User.findOne({ username });
    return await handle2FAVerification(user, twofaCode, res);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "משהו השתבש" });
  }
});

module.exports = router;
