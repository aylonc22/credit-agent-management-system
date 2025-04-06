const express = require('express');
const User = require('../../models/User');
const { encryptAES, decryptAES } = require('../../utils/hashPassword');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/', authMiddleware, async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(id);        
        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא' });
        }

        // Decrypt the stored password to compare it with the current password provided by the user
        const decryptedPassword = await decryptAES(user.password);
        // Compare the current password with the decrypted stored password
        if (currentPassword !== decryptedPassword) {
            return res.status(400).json({ message: 'הסיסמה הנוכחית אינה נכונה' });
        }

        // Encrypt the new password
        const encryptedPassword = encryptAES(newPassword);

        // Update the user's password with the new encrypted password
        user.password = encryptedPassword;
        await user.save();

        // Return a success response
        return res.status(200).json({ message: 'הסיסמה שונתה בהצלחה' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'שגיאה בשרת' });
    }
});

module.exports = router;
