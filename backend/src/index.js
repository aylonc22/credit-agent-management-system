const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/notifications/email", (req, res) => {
    const { to, subject, message } = req.body;
    console.log(`Email to: ${to}, subject: ${subject}, message: ${message}`);
    res.status(200).json({ message: "Email sent (simulated)" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
