const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../../models/User');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {   
    const { id } = req.user;  // Logged-in user ID
    const { twofaCode } = req.body;  // 2FA code from the request body

    try {
        // Check if parameters are missing
        if (!id || !twofaCode) {
            return res.status(400).json({ message: "חסרים פרמטרים" });  // Missing parameters
        }

        // Find the user in the database
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });  // User not found
        }       
        // Check if the provided 2FA code matches the stored code
        if (user.twoFA.code !== twofaCode) {
            return res.status(400).json({ message: "קוד 2FA לא נכון" });  // Incorrect 2FA code
        }

        // Optionally, check if the 2FA code has expired (if you have an expiration timestamp)
        const now = new Date();
        const expirationTime = user.twofaCodeExpiration;  // Assuming you store expiration time
        if (now > expirationTime) {
            return res.status(410).json({ message: "הקוד פג תוקף" });  // Code has expired
        }

        // If the code is correct and not expired, mark the 2FA as verified
        user.twoFA = { 
            enabled:true,
            verified:true,      
            code: null,
            expiresAt: null,
        };

        // Save the user document
        await user.save();
        const newToken = await generateToken({  id: user._id, role: user.role , twofaEnabled: user.twoFA.enabled });
        console.log(newToken);
        res.setHeader('x-access-token', newToken);
        console.log(res.getHeaders())
        return res.status(200).json({ message: "הקוד אושר בהצלחה!" });  // 2FA verification successful
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "משהו השתבש" });  // Something went wrong
    }
});

module.exports = router;
