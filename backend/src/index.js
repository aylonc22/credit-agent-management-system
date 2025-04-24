const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const User = require("./models/User");
const { encryptAES } = require("./utils/hashPassword");
const Settings = require("./models/Settings");
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
        logo: process.env.SERVER_URL + '/uploads/fish.jpg',
        backgroundImage: '',
        welcomeMessage: 'ברוך הבא למערכת!',
        termsOfUse: 'תנאי השימוש של המערכת.',
      });

      await defaultSettings.save();
      console.log('✅ Default settings created.');
    } else {
      console.log('✅ Settings already exist.');
    }   
    
  } catch (e) {
    console.error('❌ Error during initApp:', e.message);
  }
}
