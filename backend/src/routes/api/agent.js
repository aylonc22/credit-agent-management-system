const express = require('express');
const autheMiddleware = require('../middleware/authMiddleware');
const Agent = require('../../models/Agent');
const User = require('../../models/User');
const { encryptAES } = require('../../utils/hashPassword');
const router = express.Router();

router.get('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         
         if(isAdmin)
         {
            const agents = await Agent.find().populate('userId', 'email');;
            
            if(agents)
            {
                res.status(200).json({message:"סוכנים הוצאו בהצלחה", agents});
            }else{
                res.status(404).json({message:"סוכנים לא נמצאו במאגר המידע"});
            }
         }else{
            res.status(401).json({message:"אין הרשאה להוציא סוכנים ממאגר המידע"});
         }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"חלה שגיאה בהוצאת סוכנים"})
    }
});

router.post('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         
         if(isAdmin)
         {
            const { email, name, username, password } = req.body;
            if (!name || !username || !password || !email) {
                res.status(400).json({message:"חסרים שדות חיוניים"})
            }else{
                const hashedPassword = encryptAES(password);

                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email:email,
                    role:'agent',     
                  });
              
                  await newUser.save();

                  const newAgent = new Agent({
                    userId: newUser._id,
                    name,       
                  });
                  await newAgent.save();

                  res.status(201).json({message:"סוכן חדש נוצר"})
            }
          
         }else{
            res.status(401).json({message:"אין הרשאה ליצור סוכן חדש"});
         }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"חלה ביצירת סוכן חדש"})
    }
});

router.put('/:id/block', autheMiddleware ,async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
         
        if(isAdmin)
        {
        const { id } = req.params;
        const agent = await Agent.findById(id);
    
        if (!agent) {
            return res.status(404).send({ message: 'סוכן לא נמצא' });
        }
    
        agent.status = 'inactive'; // or "inactive", depending on your system
        await agent.save();
    
        res.status(200).send({ message: 'הסוכן חסום בהצלחה' });
    }else{
        res.status(401).json({message:"אין הרשאה לחסום סוכן"});
     }
    } catch (error) {
      res.status(500).send({ message: 'שגיאה בחסימת הסוכן' });
    }
  });

  router.put('/:id/unblock', autheMiddleware, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
         
        if(isAdmin)
        {
            const { id } = req.params;
            const agent = await Agent.findById(id);
        
            if (!agent) {
                return res.status(404).send({ message: 'סוכן לא נמצא' });
            }
        
            // Change status to "active" or "unblocked"
            agent.status = 'active'; // or 'unblocked', based on your system
            await agent.save();
        
            res.status(200).send({ message: 'הסוכן שוחרר בהצלחה' });
        }else{
            res.status(401).json({message:"אין הרשאה לשחרר סוכן"});
        }

    } catch (error) {
        console.log(error);
      res.status(500).send({ message: 'שגיאה בשחרור הסוכן' });
    }
  });

module.exports = router;
