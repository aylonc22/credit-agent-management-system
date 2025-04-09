const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../../models/User');
const Settings = require('../../models/Settings');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {   
    const  {id}  = req.user;  // Logged-in user ID            
    try {                            
        const user = await User.findById(id);
       
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });  // User not found
        }               
       
        user.twoFA = { 
            enabled:false,
            verified:true,      
            code: null,
            expiresAt: null,
        };

        // Save the user document
        await user.save();
        const newToken = await generateToken({  id: user._id, role: user.role , twofaEnabled: user.twoFA.enabled });
        res.setHeader('x-access-token', newToken);  
             
        return res.status(200).json({ message: "2fa בוטל בהצלחה!"  });  // 2FA disabled successful
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "משהו השתבש" });  // Something went wrong
    }
});

module.exports = router;
