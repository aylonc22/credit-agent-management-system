const express = require('express');
const User = require('../../models/User');
const Settings = require('../../models/Settings'); // Assuming you have a settings model
const { decryptAES } = require('../../utils/hashPassword');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'פרטי ההתחברות אינם נכונים' });
    }
    
    // 1. Check if the password matches
    const isPasswordValid = password === await decryptAES(user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'פרטי ההתחברות אינם נכונים' });
    }

    // 2. Retrieve the password expiry days from settings
    const settings = await Settings.findOne(); // Assuming you have only one settings document
    const passwordExpiryDays = settings.passwordExpiryDays;

    // 3. Check if the password is expired
    const passwordChangedAt = new Date(user.passwordChangedAt);
    const expiryDate = new Date(passwordChangedAt);
    expiryDate.setDate(expiryDate.getDate() + passwordExpiryDays);

    if (expiryDate < new Date()) {
      // Password is expired
      return res.status(403).json({ id: user._id , message: 'הסיסמה שלך פגה. אנא שנה את הסיסמה שלך.' });
    }

    
    

    console.log(`Trying to generate jwt token for user ${user._id}`);
    const token = generateToken({ id: user._id, role: user.role });
    console.log("Jwt token generated successfully");

    res.status(200).json({ message: settings.welcomeMessage, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'שגיאה בשרת', error });
  }
});

module.exports = router;
