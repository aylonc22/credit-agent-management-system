const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../../models/User');
const { twoFaVerification } = require('../../utils/email');
const router = express.Router();


function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

router.post('/', authMiddleware , async (req, res) => {
    const {id} = req.user;
    try{       
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"משתמש לא נמצא"});
        }
        // Generate a new verification code
        const newCode = generateVerificationCode();

        // Set a new expiration time (e.g., 10 minutes from now)
        const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update the user's verification code and expiration date
        user.twoFA = {            
            code: newCode,
            expiresAt: newExpiresAt,
        };

        await user.save();
        //await twoFaVerification(user.email);
        console.log(newCode);
        return res.status(200).json({message:"קוד אימות נשלח בהצלחה. אנא בדוק את כתובת האימייל שלך"});

    }catch(e){
        console.log(e);
        return res.status(500).json({message:'משהו השתבש'})
    }
});

module.exports = router;
