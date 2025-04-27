const express = require('express');
const OneTimeLink = require('../../models/OneTimeLink');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const {token} = req.body;
    if (token) {
         const invite = await OneTimeLink.findOne({ token: token, used: false, clicked: false });
   
         if (!invite || invite.expiresAt < new Date()  || invite.role !== 'payment'){
           return res.status(400).json({ message: 'קישור הזמנה לא חוקי או פג תוקף' });
         }
   
            const redirectTo = invite.metadata;

            await invite.save();
           
            return res.status(200).json({redirectTo, message:"הועבר בהצלחה"});
        
       }
    }
    catch(e){
            console.log(e);
            return res.status(500).json({ message: 'העברה לספק קנייה נכשלה' });
    }
}
);

module.exports = router;
