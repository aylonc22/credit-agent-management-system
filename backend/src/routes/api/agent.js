const express = require('express');
const autheMiddleware = require('../middleware/authMiddleware');
const Agent = require('../../models/Agent');
const User = require('../../models/User');
const { encryptAES } = require('../../utils/hashPassword');
const router = express.Router();

router.get('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         const isMaster = req.user.role === 'master-agent';
         const agentId = req.user.agentId;  
         const pushSelf = req.query.pushSelf;       
         
         if(isAdmin)
         {
            const agents = await Agent.find().populate('userId', 'email role');;
            
            if(agents)
            {
                return res.status(200).json({message:"סוכנים הוצאו בהצלחה", agents});
            }else{
                return res.status(404).json({message:"סוכנים לא נמצאו במאגר המידע"});
            }
         }else if(isMaster){
            const agents = await Agent.find({masterId:agentId}).populate('userId', 'email role');;
            if(pushSelf){
                const self = await Agent.findOne({userId:req.user.id});
                agents.push(self);
            }
            if(agents)
            {
                return res.status(200).json({message:"סוכנים הוצאו בהצלחה", agents});
            }else{
                return res.status(404).json({message:"סוכנים לא נמצאו במאגר המידע"});
            }
         }else{
            return res.status(401).json({message:"אין הרשאה להוציא סוכנים ממאגר המידע"});
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
            const { email, name, username, password, role } = req.body;
            if (!name || !username || !password || !email) {
                return res.status(400).json({message:"חסרים שדות חיוניים"})
            }else{
                const hashedPassword = encryptAES(password);

                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email:email,
                    role: role, 
                    twoFA:{
                        enabled:true,
                        verified:true,
                        code:null,
                        expiresAt:null,
                    }    
                  });
              
                  await newUser.save();

                  const newAgent = new Agent({
                    userId: newUser._id,
                    name,       
                  });
                  await newAgent.save();

                  return res.status(201).json({message:"סוכן חדש נוצר"})
            }
          
         }else{
            res.status(401).json({message:"אין הרשאה ליצור סוכן חדש"});
         }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"חלה שגיאה ביצירת סוכן חדש"})
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
    
        return res.status(200).send({ message: 'הסוכן חסום בהצלחה' });
    }else{
        return res.status(401).json({message:"אין הרשאה לחסום סוכן"});
     }
    } catch (error) {
        return res.status(500).send({ message: 'שגיאה בחסימת הסוכן' });
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
        
            return res.status(200).send({ message: 'הסוכן שוחרר בהצלחה' });
        }else{
            return res.status(401).json({message:"אין הרשאה לשחרר סוכן"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'שגיאה בשחרור הסוכן' });
    }
  });

  router.put('/:id/promote', autheMiddleware, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';

        if (isAdmin) {
            const { id } = req.params;
            const user = await User.findById(id);
        
            if (!user) {
                return res.status(404).send({ message: 'סוכן לא נמצא' });
            }
        
            // Change role to "master-agent"
            user.role = 'master-agent';
            await user.save();
        
            return res.status(200).send({ message: 'הסוכן קודם בהצלחה לסוכן ראשי' });
        } else {
            return res.status(401).json({ message: "אין הרשאה לקדם סוכן" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'שגיאה בקידום הסוכן' });
    }
});

    router.put('/:id/demote', autheMiddleware, async (req, res) => {
        try {
            const isAdmin = req.user.role === 'admin';

            if (isAdmin) {
                const { id } = req.params;                
                const user = await User.findById(id);
            
                if (!user) {
                    return res.status(404).send({ message: 'סוכן לא נמצא' });
                }
            
                // Change role to "agent"
                user.role = 'agent';
                await user.save();
            
                return res.status(200).send({ message: 'הסוכן הוחזר בהצלחה לסוכן רגיל' });
            } else {
                return res.status(401).json({ message: "אין הרשאה להוריד סוכן" });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'שגיאה בהורדת הסוכן' });
        }
    });



module.exports = router;
