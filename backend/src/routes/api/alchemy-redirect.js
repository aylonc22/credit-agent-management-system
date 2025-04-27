const express = require('express');
const fetch = require('node-fetch');
const autheMiddleware = require('../middleware/authMiddleware');
const {v4:uuidv4} = require('uuid');
const Transaction = require('../../models/Transaction'); // make sure path is correct
const OneTimeLink = require('../../models/OneTimeLink');
const generateAlchemy = require('../../utils/alchemyPay');
const Client = require('../../models/Client');
const router = express.Router();
require('dotenv').config();

const WALLET_ADDRESS = process.env.WALLET;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '3001'; // fallback to default dev port
const SERVER_URL = `${process.env.SERVER_URL}${isProduction ? '' : `:${port}`}`;

router.post('/', async (req, res) => {
  try {
    const {token} = req.body;
    if (token) {
         const invite = await OneTimeLink.findOne({ token: token, used: false, clicked: false });
   
         if (!invite || invite.expiresAt < new Date()  || invite.role !== 'payment'){
           return res.status(400).json({ message: 'קישור הזמנה לא חוקי או פג תוקף' });
         }
   
            const redirectTo = invite.metadata;

            invite.clicked = true;
            await invite.save();
            console.log(redirectTo);
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
