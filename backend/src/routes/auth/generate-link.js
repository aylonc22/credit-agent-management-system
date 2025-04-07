const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');
const OneTimeLink = require('../../models/OneTimeLink');
const router = express.Router();

router.post('/admin', authMiddleware, async (req, res) => {
  try {
    if(req.user.role !== 'admin'){
        res.status(401).json({ message: 'אין הרשאה ליצור קישור' });
    }
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    const link = new OneTimeLink({ token, role: 'admin', expiresAt });
    await link.save();

    const registrationUrl = `${process.env.FRONTEND_URL}/register?token=${token}`;
    res.json({ link: registrationUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה ביצירת קישור מנהל' });
  }
});

router.post('/agent', authMiddleware, async (req, res) => {
    try {
        if(req.user.role !== 'admin'){
            res.status(401).json({ message: 'אין הרשאה ליצור קישור' });
        }
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes expiry
  
      const link = new OneTimeLink({ token, role: 'agent', expiresAt });
      await link.save();
  
      const registrationUrl = `${process.env.FRONTEND_URL}/register?token=${token}`;
      res.json({ link: registrationUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'שגיאה ביצירת קישור סוכן' });
    }
  });

  router.get('/:token', async (req,res) => {
        const { token } = req.params;
        if(!token){
            res.status(400).json({ message: 'קישור חסר' });
        }
        const invite = await OneTimeLink.findOne({ token: token, clicked: false, });

        if(!invite){
            res.status(404).json({ message: 'הקישור לא תקף אנא צור אחד חדש' });
        }
        else{
            res.json({message:'קישור נמצא'});
        }
  });

  router.put('/:token', async (req,res) => {   
    const { token } = req.params;
    if(!token){
        res.status(400).json({ message: 'קישור חסר' });
    }
    const invite = await OneTimeLink.findOne({ token: token, clicked: false });
    
    if (invite) {
        await OneTimeLink.findByIdAndUpdate(invite._id, { clicked: true });
        res.status(200).json({message:'הקישור עודכן בהצלחה'});
      }
    else{
        res.status(404).json({message:'הקישור לא תקף אנא צור אחד חדש'});
    }
});



  module.exports = router;