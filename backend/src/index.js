const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const User = require("./models/User");
const { encryptAES, decryptAES } = require("./utils/hashPassword");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
    initApp();
});


async function initApp() {
 try{
  const existingAdmin = await User.findOne({username: 'admin'});
 
  if(!existingAdmin){
    const newAdmin = new User({
      username: 'admin',
      password: encryptAES('admin'),
      role: 'admin',
      permissions: ['all'],
    });

    await newAdmin.save();
    console.log('✅ Default admin user created.');
  } else{
    console.log('✅ Admin user already exists.');
  }
 }
 catch(e){
  console.error('❌ Error during initApp:', e.message);
 }

}