const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const autheMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Replace with your actual integration credentials
const CLIENT_ID = process.COINPAYMENTS_ID;
const CLIENT_SECRET = process.COINPAYMENTS_SECRET;
const COINPAYMENTS_API_URL = 'https://api.coinpayments.com/api/v2/merchant/invoices';

// Helper to generate HMAC signature
function generateHmacSignature(method, url, clientId, timestamp, payload) {
  const message =
    '\ufeff' + // BOM
    method.toUpperCase() +
    url +
    clientId +
    timestamp +
    payload;

  return crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(message)
    .digest('base64');
}

// Route to create a minimal invoice link
router.post('/create-invoice', autheMiddleware, async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ message: 'חסרים שדות חיוניים' });
    }

    const invoicePayload = {
      currency: 'USD',
      items: [
        {
          name,
          quantity: { value: 1, type: 1 },
          amount: amount.toString()
        }
      ],
      amount: {
        breakdown: {
          subtotal: amount.toString()
        },
        total: amount.toString()
      }
    };

    const jsonPayload = JSON.stringify(invoicePayload);
    const timestamp = new Date().toISOString().split('.')[0]; // No milliseconds or timezone
    const signature = generateHmacSignature(
      'POST',
      '/api/v2/merchant/invoices',
      CLIENT_ID,
      timestamp,
      jsonPayload
    );

    const response = await fetch(COINPAYMENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CoinPayments-Client': CLIENT_ID,
        'X-CoinPayments-Timestamp': timestamp,
        'X-CoinPayments-Signature': signature
      },
      body: jsonPayload
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('CoinPayments API Error:', data);
      return res.status(500).json({ message: 'שגיאה ביצירת החשבונית', error: data });
    }

    const { id, link } = data.result;
    return res.status(201).json({
      message: 'החשבונית נוצרה בהצלחה',
      invoice_id: id,
      checkout_url: link
    });
  } catch (err) {
    console.error('Error creating invoice:', err);
    return res.status(500).json({ message: 'שגיאה כללית ביצירת חשבונית' });
  }
});

module.exports = router;
