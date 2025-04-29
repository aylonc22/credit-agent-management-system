const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../../models/User');
const { twoFaVerification } = require('../../utils/email');
const router = express.Router();

// Utility: Generate 6-digit verification code
function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}


async function send2FACode(user) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.twoFA = {
    enabled:true,
    verified:true,
    code,
    expiresAt,
  };

  await user.save();
  await twoFaVerification(user.email, code);
  console.log('2FA Code:', code);
}

// 🔓 Public route - based on username
router.post('/', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    await send2FACode(user);
    return res.status(200).json({ message: 'קוד אימות נשלח בהצלחה. אנא בדוק את כתובת האימייל שלך' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'משהו השתבש' });
  }
});

// 🔐 Protected route - based on user from token
router.post('/protected', authMiddleware, async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    await send2FACode(user);
    return res.status(200).json({ message: 'קוד אימות נשלח בהצלחה. אנא בדוק את כתובת האימייל שלך' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'משהו השתבש' });
  }
});

module.exports = {router,send2FACode};
