const express = require('express');
const fetch = require('node-fetch');
const autheMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../../models/Transaction'); // make sure path is correct
const router = express.Router();
require('dotenv').config();

const WALLET_ADDRESS = process.env.WALLET;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '3001'; // fallback to default dev port
const SERVER_URL = `${process.env.SERVER_URL}${isProduction ? '' : `:${port}`}`;

const CARD2CRYPTO_API_URL = 'https://api.card2crypto.org/control/wallet.php';

router.post('/', autheMiddleware, async (req, res) => {
  try {
    const { clientId, amount, email, notes } = req.body;

    if (!clientId || !amount || !email) {
      return res.status(400).json({ message: 'חסרים שדות חיוניים' });
    }

    // Create transaction with status "pending"
    const transaction = await Transaction.create({
      agent: req.user.agentId,
      client: clientId,
      amount,
      notes,
      status: 'pending',
    });

    // ✅ Append transaction ID to callback URL
    const callbackUrl = `${SERVER_URL}/api/payment-callback?transactionId=${transaction._id}`;

    const walletRes = await fetch(
      `${CARD2CRYPTO_API_URL}?address=${encodeURIComponent(WALLET_ADDRESS)}&callback=${encodeURIComponent(callbackUrl)}`
    );

    const walletData = await walletRes.json();

    if (!walletRes.ok || !walletData.address_in) {
      console.error('Card2Crypto Wallet API Error:', walletData);
      return res.status(500).json({ message: 'שגיאה בהפקת כתובת הארנק' });
    }

    const encryptedAddress = walletData.address_in;

    const paymentUrl = `https://pay.card2crypto.org/process-payment.php?address=${encryptedAddress}&amount=${amount}&provider=wert&email=${email}&currency=USD`;

    console.log(callbackUrl+'&value_coin=2');


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
