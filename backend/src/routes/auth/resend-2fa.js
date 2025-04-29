const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const { send2FACode } = require('./enable-2fa'); // Assuming send2FACode is exported
// If not exported, copy the function here again

// Public route to resend 2FA code
router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'שם המשתמש נדרש' });
  }

  try {   
    const user = await User.findOne({username });
   
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    await send2FACode(user);
    return res.status(200).json({ message: 'קוד האימות נשלח שוב למייל שלך' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'שליחה מחדש נכשלה. נסה שוב מאוחר יותר.' });
  }
});

module.exports = router;