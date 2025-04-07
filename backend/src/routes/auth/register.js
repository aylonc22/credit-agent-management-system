const express = require('express');
const { encryptAES } = require('../../utils/hashPassword');
const User = require('../../models/User');
const Client = require('../../models/Client');
const OneTimeLink = require('../../models/OneTimeLink');
const Agent = require('../../models/Agent');
const Settings = require('../../models/Settings');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/:agentId', async (req, res) => {  
  const { email, name, username, password } = req.body;
  const { agentId } = req.params;

  try {
    // 1. Check username uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם משתמש כבר תפוס' });
    }
    
    // 2. Agent reference
    let agentRef = agentId || null;
    
    // 3. Hash password
    const hashedPassword = encryptAES(password);

    // 4. Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      email:email,
      role,     
    });

    await newUser.save();
   
      const newClient = new Client({
        username,
        name,        
        agent: agentRef || null,
      });
      await newClient.save();    
    

    // 6 Get Welcome Message
    const settings = await Settings.findOne();
    // 7. Return JWT
    const token = generateToken({ id: newUser._id, role: newUser.role });
    res.status(201).json({ message: settings.welcomeMessage ? settings.welcomeMessage : 'המשתמש נרשם בהצלחה', token });

  } catch (error) {
    console.error('Registeration error:', error);
    res.status(500).json({ message: 'משהו השתבש במהלך ההרשמה', error: error.message });
  }
});

router.post('/', async (req, res) => {  
  const { email, name, username, password, inviteToken } = req.body;

  try {
    // 1. Check username uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם משתמש כבר תפוס' });
    }

    let role = 'client';
    let inviteId;

    // 2. Handle Invite Token (for admin or agent creation)
    if (inviteToken) {
      const invite = await OneTimeLink.findOne({ token: inviteToken, used: false, clicked: true });

      if (!invite || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: 'קישור הזמנה לא חוקי או פג תוקף' });
      }

      role = invite.role;
      inviteId = invite._id;
    }

    // 3. Hash password
    const hashedPassword = encryptAES(password);

    // 4. Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email,
      role,     
    });

    await newUser.save();

    // 5. Create related document (Agent or Client)
    if (role === 'agent') {
      const newAgent = new Agent({
        userId: newUser._id,
        name,       
      });
      await newAgent.save();
    } else if (role === 'client') {
      const newClient = new Client({
        username,
        name,       
        agent: null,
      });
      await newClient.save();
    }

    // 6 Get Welcome Message
    const settings = await Settings.findOne();
    // 7. Return JWT
    const token = generateToken({ id: newUser._id, role: newUser.role });
    res.status(201).json({ message: settings.welcomeMessage ? settings.welcomeMessage : 'המשתמש נרשם בהצלחה', token });

  } catch (error) {
    console.error('Registeration error:', error);
    res.status(500).json({ message: 'משהו השתבש במהלך ההרשמה', error: error.message });
  }
});

module.exports = router;
