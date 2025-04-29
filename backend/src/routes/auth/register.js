const express = require('express');
const { encryptAES } = require('../../utils/hashPassword');
const User = require('../../models/User');
const Client = require('../../models/Client');
const OneTimeLink = require('../../models/OneTimeLink');
const Agent = require('../../models/Agent');
const Settings = require('../../models/Settings');
const { generateToken } = require('../../utils/jwt');
const { twoFaVerification } = require('../../utils/email');
const router = express.Router();

// Utility: Generate 6-digit verification code
function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

router.post('/:agentId', async (req, res) => {  
  const { email, name, username, password, inviteToken } = req.body;
  const { agentId } = req.params;

  try {
    // 1. Check username uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם משתמש כבר תפוס' });
    }

    let role = 'client';   

    // 2. Handle Invite Token (for admin or agent creation)
    if (inviteToken) {
      const invite = await OneTimeLink.findOne({ token: inviteToken, used: false, clicked: true });

      if (!invite || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: 'קישור הזמנה לא חוקי או פג תוקף' });
      }

      role = invite.role;
     
    }
    
    // 2.5 Agent reference
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

    if (role === 'agent') {
      const newAgent = new Agent({
        userId: newUser._id,
        name,       
        masterId: agentRef,
      });
      await newAgent.save(); 

     
        const code = generateVerificationCode(); // your 6-digit function
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
        newUser.twoFA = {
          enabled:true,
          verified:true,
          code,
          expiresAt,
        }
        await newUser.save();
  
        await twoFaVerification(newUser.email)
        console.log(code);
        return res.status(202).json({message:"משתמש עם הרשאות נוצר אנא התחבר שוב ואמת את כתובת האימייל באמצעות המייל שקיבלת"});
      
    }else{
        const newClient = new Client({
          username,
          name,        
          agentId: agentRef,
          userId: newUser._id,
        });
      await newClient.save();       
      }

    // 6 Get Welcome Message
    const settings = await Settings.findOne();
    // 7. Return JWT
    const token = await generateToken({ id: newUser._id, role: newUser.role, twofaEnabled: newUser.twoFA.enabled });
    return res.status(201).json({ message: settings.welcomeMessage ? settings.welcomeMessage : 'המשתמש נרשם בהצלחה', token });

  } catch (error) {
    console.error('Registeration error:', error);
    return res.status(500).json({ message: 'משהו השתבש במהלך ההרשמה', error: error.message });
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

    // 2. Handle Invite Token (for admin or agent creation)
    if (inviteToken) {
      const invite = await OneTimeLink.findOne({ token: inviteToken, used: false, clicked: true });

      if (!invite || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: 'קישור הזמנה לא חוקי או פג תוקף' });
      }

      role = invite.role;   
      invite.used = true; 
      await invite.save();
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
    if (role.includes('agent')) {
      const newAgent = new Agent({
        userId: newUser._id,
        name,       
      });
      await newAgent.save();
    } else if (role === 'client') {
      const newClient = new Client({
        username,
        name,       
        agentId: null,
        userId:newUser._id,
      });
      await newClient.save();
    }

    if(role !== 'client'){
      const code = generateVerificationCode(); // your 6-digit function
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      newUser.twoFA = {
        enabled:true,
        verified:true,
        code,
        expiresAt,
      }
      await newUser.save();

      await twoFaVerification(newUser.email, code);
      console.log(code);
      return res.status(202).json({message:"משתמש עם הרשאות נוצר אנא התחבר שוב ואמת את כתובת האימייל באמצעות המייל שקיבלת"});
    }
    
    // 6 Get Welcome Message
    const settings = await Settings.findOne();
    // 7. Return JWT
    const token = await generateToken({ id: newUser._id, role: newUser.role, twofaEnabled: newUser.twoFA.enabled });
   return res.status(201).json({ message: settings.welcomeMessage ? settings.welcomeMessage : 'המשתמש נרשם בהצלחה', token });

  } catch (error) {
    console.error('Registeration error:', error);
   return res.status(500).json({ message: 'משהו השתבש במהלך ההרשמה', error: error.message });
  }
});

module.exports = router;
