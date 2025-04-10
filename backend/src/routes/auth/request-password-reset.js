const express = require('express');
const User = require('../../models/User');
const { v4: uuidv4 } = require('uuid');
const OneTimeLink = require('../../models/OneTimeLink');
const { resetPassword } = require('../../utils/email');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
      // Check if the email exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'כתובת אימייל לא נמצאה' });
      }
  
      // Generate a password reset token (valid for 1 hour)
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 60 minutes expiry
  
      const link = new OneTimeLink({ token:resetToken, role: 'agent', expiresAt });
      await link.save();
       
  
      // Create a reset password URL (including the token)     
      const resetUrl = `${process.env.FRONTEND_URL}/change-password/${user._id}?token=${resetToken}`;

      await resetPassword(email,resetUrl);        
  
      // Respond to the client with success
      res.status(200).json({ message: 'לינק לשינוי סיסמה נשלח לכתובת האימייל שלך.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'חלה שגיאה בזמן ניסיון שלחית לינק לאיפוס סיסמה' });
    }
  });

module.exports = router;
