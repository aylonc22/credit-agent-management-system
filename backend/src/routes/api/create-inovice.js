const express = require('express');
const fetch = require('node-fetch');
const autheMiddleware = require('../middleware/authMiddleware');
const {v4:uuidv4} = require('uuid');
const Transaction = require('../../models/Transaction'); // make sure path is correct
const OneTimeLink = require('../../models/OneTimeLink');
const generateAlchemy = require('../../utils/alchemyPay');
const router = express.Router();
require('dotenv').config();

const WALLET_ADDRESS = process.env.WALLET;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '3001'; // fallback to default dev port
const SERVER_URL = `${process.env.SERVER_URL}${isProduction ? '' : `:${port}`}`;

router.post('/', autheMiddleware, async (req, res) => {
  try {
    const { clientId, amount, notes } = req.body;

    if (!clientId || !amount ) {
      return res.status(400).json({ message: 'חסרים שדות חיוניים' });
    }

    const timestamp = String(Date.now());
    const uuid = uuidv4();
    const order = `${uuid}-${timestamp}`;

    // Create transaction with status "pending"
    const transaction = await Transaction.create({
      agent: req.user.agentId,
      client: clientId,
      amount,
      merchantOrderNo:order,
      notes,
      status: 'pending',
    });

    // ✅ Append transaction ID to callback URL
    const callbackUrl = `${SERVER_URL}/api/payment-callback?transactionOrder=${transaction.merchantOrderNo}`;

   

    const alchemyUrl = generateAlchemy(WALLET_ADDRESS, amount, order, timestamp, callbackUrl);

    if(req.user.role === 'client'){
      return res.status(201).json({
        message: 'החשבונית נוצרה בהצלחה',
        checkout_url: alchemyUrl,
      });
    }

     const token = uuidv4();
              const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes expiry
          
              const link = new OneTimeLink({ token, role: 'payment', expiresAt, metadata: alchemyUrl});
              await link.save();
          
              const paymentUrl = `${process.env.FRONTEND_URL}/payment?token=${token}`;


    return res.status(201).json({
      message: 'החשבונית נוצרה בהצלחה',
      checkout_url: paymentUrl,
    });
  } catch (err) {
    console.error('Error creating payment link:', err);
    return res.status(500).json({ message: 'שגיאה כללית ביצירת חשבון' });
  }
});

module.exports = router;
