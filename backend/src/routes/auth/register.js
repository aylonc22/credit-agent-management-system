const express = require('express');
const { encryptAES } = require('../../utils/hashPassword');
const User = require('../../models/User');
const Client = require('../../models/Client');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, name, username, password, agent } = req.body;
 
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const hashedPassword = encryptAES(password);

    // Create the user document
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'client',  // Initially, the user will be a client
      permissions: [],  // No special permissions at registration
    });

    // Save the user to the database
    await newUser.save();

    // Create the client document associated with the user
    const newClient = new Client({
      name,
      username,
      email,     
      agent: agent, // Set the agent reference if needed (or leave as null)
    });

    // Save the client document to the database
    await newClient.save();
    // Generate JWT token using your utility
    const token = generateToken({id: newUser._id, role: newUser.role});

    // Send the token to the client (you can choose to send user info or only the token)
    res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong during registration', error: error.message });
  }
});

module.exports = router;
