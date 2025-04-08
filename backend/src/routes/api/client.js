const express = require('express');
const autheMiddleware = require('../middleware/authMiddleware');
const Agent = require('../../models/Agent');
const User = require('../../models/User');
const Client = require('../../models/Client');
const { encryptAES } = require('../../utils/hashPassword');
const router = express.Router();

router.get('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         const isAgent = req.user.role === 'agent';
         const _agentId = req.user.agentId;
         
         if(isAdmin)
         {
            const clients = await Client.find().populate('userId', 'email');;
            
            if(clients)
            {
                res.status(200).json({message:"לקוחות הוצאו בהצלחה", clients});
            }else{
                res.status(404).json({message:"לקוחות לא נמצאו במאגר המידע"});
            }
         }else if(isAgent){
            const clients = await Client.find({agent:_agentId}).populate('userId', 'email');;
            
            if(clients)
            {
                res.status(200).json({message:"לקוחות הוצאו בהצלחה", clients});
            }else{
                res.status(404).json({message:"לקוחות לא נמצאו במאגר המידע"});
            }

         }else{
            res.status(401).json({message:"אין הרשאה להוציא לקוחות ממאגר המידע"});
         }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"חלה שגיאה בהוצאת לקוחות"})
    }
});

router.post('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         const _agentId = req.user.agentId;
         const { email, name, username, password, agentId, credit} = req.body;        
         //Give access to create only if user is admin or its related agent
         console.log(agentId);
         if(isAdmin || agentId === _agentId)
         {
            if (!name || !username || !password || !email) {
                res.status(400).json({message:"חסרים שדות חיוניים"})
            }else{
                const hashedPassword = encryptAES(password);

                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email:email,
                    role:'client',     
                  });
              
                  await newUser.save();

                  const newClient = new Client({
                    userId: newUser._id,
                    agentId: agentId,
                    name,  
                    credit : credit? credit:0    
                  });
                  await newClient.save();

                  res.status(201).json({message:"לקוח חדש נוצר"})
            }
          
         }else{
            res.status(401).json({message:"אין הרשאה ליצור לקוח חדש"});
         }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"חלה שגיאה ביצירת לקוח חדש"})
    }
});

router.put('/:id/block', autheMiddleware ,async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const _agentId = req.user.agentId;
        const { id } = req.params;
        const client = await Client.findById(id);
         
        if(isAdmin || client?.agentId == _agentId)
        {
        if (!client) {
            return res.status(404).send({ message: 'לקוח לא נמצא' });
        }
    
        client.status = 'inactive'; // or "inactive", depending on your system
        await client.save();
    
        res.status(200).send({ message: 'לקוח לקוח בהצלחה' });
    }else{
        res.status(401).json({message:"אין הרשאה לחסום לקוח"});
     }
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: 'שגיאה בחסימת הלקוח' });
    }
  });

  router.put('/:id/unblock', autheMiddleware, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const _agentId = req.user.agentId;
        const { id } = req.params;
        const client = await Client.findById(id);
        if(isAdmin || client?.agentId == _agentId)
        {
            if (!client) {
                return res.status(404).send({ message: 'לקוח לא נמצא' });
            }
        
            // Change status to "active" or "unblocked"
            client.status = 'active'; // or 'unblocked', based on your system
            await client.save();
        
            res.status(200).send({ message: 'הלקוח שוחרר בהצלחה' });
        }else{
            res.status(401).json({message:"אין הרשאה לשחרר לקוח"});
        }

    } catch (error) {
        console.log(error);
      res.status(500).send({ message: 'שגיאה בשחרור הלקוח' });
    }
  });

module.exports = router;