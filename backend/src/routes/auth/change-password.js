const express = require('express');
const User = require('../../models/User');
const OneTimeLink = require('../../models/OneTimeLink');
const { encryptAES, decryptAES } = require('../../utils/hashPassword');

const router = express.Router();

router.put('/', async (req, res) => {
    const { id, currentPassword, newPassword, token } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא' });
        }

        if (token) {
            // Check one-time link
            const oneTimeLink = await OneTimeLink.findOne({ token, used: false});
            if (!oneTimeLink) {
                return res.status(401).json({ message: 'הקישור לא חוקי או שפג תוקפו' });
            }

            // Invalidate the link
            oneTimeLink.used = true;
            await oneTimeLink.save();
        } else {
            // Normal password update, verify current password
            const decryptedPassword = await decryptAES(user.password);
            if (currentPassword !== decryptedPassword) {
                return res.status(400).json({ message: 'הסיסמה הנוכחית אינה נכונה' });
            }
        }

        const encryptedPassword = encryptAES(newPassword);
        user.password = encryptedPassword;
        user.passwordChangedAt = Date.now();
        await user.save();

        return res.status(200).json({ message: 'הסיסמה שונתה בהצלחה' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'שגיאה בשרת' });
    }
});

module.exports = router;
