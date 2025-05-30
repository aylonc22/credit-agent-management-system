const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const User = require("./models/User");
const { encryptAES } = require("./utils/hashPassword");
const Settings = require("./models/Settings");
const Transaction = require("./models/Transaction");
const {validateTransaction} = require('./utils/alchemyPay');
const Client = require("./models/Client");
const loginLimiter = require("./routes/middleware/limiter/loginLimit");
const defaultLimiter = require("./routes/middleware/limiter/defaultLimit");
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
app.use('/auth',loginLimiter, require('./routes/auth'));
app.use('/api',defaultLimiter, require('./routes/api'));
app.use('/settings',defaultLimiter, require('./routes/settings'));
// Serve static files from the 'uploads' folder
app.use('/uploads',defaultLimiter, express.static(path.join(__dirname,'/routes/settings/uploads')));

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

    const expiredTransactions = await Transaction.find( { status: 'pending', expireAt: { $lte: now } });     
    let failed = 0;
    let complete = 0;
    for(let i =0;i<expiredTransactions.length;i++){
            const verify = await validateTransaction(expiredTransactions[i].merchantOrderNo);              
            if(verify.status !== undefined){
                switch (verify.status) {                    
                    case 'PAY_FAIL':
                        expiredTransactions[i].status = 'failed';
                        failed++;
                      break;
                    case 'FINISHED':
                        complete++;
                        expiredTransactions[i].status = 'completed';
                      break;                    
                  }                                               
            
                  if(expiredTransactions[i].status === 'completed'){
                    const client = await Client.findById(expiredTransactions[i].client);
                    expiredTransactions[i].amount_paid = Number(verify.amount);
                    client.credit = Number(client.credit) + Number(verify.amount);
                    await client.save();
                  }
            }else{
                expiredTransactions[i].status = "failed";
                failed++;
            }
            await expiredTransactions[i].save();
    }
  console.log(`Marked ${failed} transactions as failed due to overtime. And found ${complete} transactions that were completed and verified them`);
}

async function initApp() {
  try {
    // Check if the admin user exists
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin) {
      const newAdmin = new User({
        username: 'admin',
        password: encryptAES('X7r#9pL!a2Vq'),
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

