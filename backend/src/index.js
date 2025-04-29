const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const User = require("./models/User");
const { encryptAES } = require("./utils/hashPassword");
const Settings = require("./models/Settings");
const Transaction = require("./models/Transaction");
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL, // Adjust for your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  exposedHeaders: ['x-access-token'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Allow custom headers 
}));
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/settings', require('./routes/settings'));
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname,'/routes/settings/uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

  const PORT = process.env.PORT || 3001;
  const HOST = process.env.SERVER_URL + ":"+ PORT ||  'http://localhost:' + PORT

app.listen(PORT, () => {
    console.log(`Backend running on ${HOST}`);
    initApp();
});



async function failExpiredTransactions() {
  const now = new Date();

  const result = await Transaction.updateMany(
    { status: 'pending', expireAt: { $lte: now } },
    { $set: { status: 'failed' } }
  );

  console.log(`Marked ${result.modifiedCount} transactions as failed due to overtime.`);
}

async function initApp() {
  try {
    // Check if the admin user exists
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin) {
      const newAdmin = new User({
        username: 'admin',
        password: encryptAES('admin'),
        email: process.env.DEFAULT_EMAIL,
        role: 'admin',       
      });

      await newAdmin.save();
      console.log('✅ Default admin user created.');
    } else {
      console.log('✅ Admin user already exists.');
    }    
    // Check if the settings document exists
    const existingSettings = await Settings.findOne();

    if (!existingSettings) {
      const defaultSettings = new Settings({
        logo: process.env.SERVER_URL + process.env.NODE_ENV === 'production'?'':process.env.PORT + '/uploads/fish.jpg',
        backgroundImage: '',
        welcomeMessage: 'ברוך הבא למערכת!',
        termsOfUse: 'תנאי השימוש של המערכת.',
      });

      await defaultSettings.save();
      console.log('✅ Default settings created.');
    } else {
      console.log('✅ Settings already exist.');
    }   
    setInterval(failExpiredTransactions, 5 * 60 * 1000);

    failExpiredTransactions();
  } catch (e) {
    console.error('❌ Error during initApp:', e.message);
  }
}

// const crypto = require('crypto');
// const fetch = require('node-fetch');

// // === CONFIG ===
// const API_KEY = 'f83Is2y7L425rxl8';
// const SECRET_KEY = '5Zp9SmtLWQ4Fh2a1';
// const BASE_URL = 'https://api.card2crypto.com'; // or your specific base URL


// const method = 'GET';
// const path = '/open/api/v4/merchant/query/UserHistory';
// const timestamp = Date.now().toString();

// const queryParams = {  
//   side: 'BUY', 
//   appid: API_KEY,
//   timestamp:timestamp,
// };

// function generateSignature({ timestamp, method, path, queryParams, secretKey }) {
//   const sortedKeys = Object.keys(queryParams).sort();
//   const sortedQueryString = sortedKeys
//     .map(k => `${k}=${queryParams[k]}`)
//     .join('&');

//   const fullPath = `${path}?${sortedQueryString}`;
//   const signString = `${timestamp}${method.toUpperCase()}${fullPath}`;

//   const hmac = crypto.createHmac('sha256', secretKey);
//   hmac.update(signString);
//   return hmac.digest('base64');
// }

// async function run() {
//   const sign = generateSignature({
//     timestamp,
//     method,
//     path,
//     queryParams,
//     secretKey: SECRET_KEY,
//   });

//   const queryString = Object.entries(queryParams)
//     .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
//     .join('&');

//   const url = `https://openapi-test.alchemypay.org/merchant/query/UserHistory`;

//   const headers = {
//     'appId': API_KEY,
//     'sign': sign,
//     'timestamp': timestamp,
//     'Content-Type': 'application/json',
//   };

//   try {
//     const response = await fetch(url, {
//       method,
//       headers,
//     });

//     const data = await response.json();
//     console.log('RESPONSE:', data);
//   } catch (err) {
//     console.error('ERROR:', err.message);
//   }
// }

// run()
