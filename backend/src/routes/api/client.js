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
         const isMaster = req.user.role ==='master-agent';
         const _agentId = req.user.agentId;
         let agentIds = [];
        
         if(isAdmin)
         {
            const clients = await Client.find().populate('userId', 'email');;
            
            if(clients)
            {
                return res.status(200).json({message:"לקוחות הוצאו בהצלחה", clients});
            }else{
                return res.status(404).json({message:"לקוחות לא נמצאו במאגר המידע"});
            }
         }else if(isMaster){
            if (req.query.agents) {
                try {
                  agentIds.push(...JSON.parse(req.query.agents));                  
                } catch (e) {
                  return res.status(400).json({ error: 'Invalid agents array' });
                }
              }            
            const clients = await Client.find({
                agentId: { $in: agentIds }
              }).populate('userId', 'email');;
                         
            if(clients)
            {                
                return res.status(200).json({message:"לקוחות הוצאו בהצלחה", clients});
            }else{
                return res.status(404).json({message:"לקוחות לא נמצאו במאגר המידע"});
            }

         }else if(isAgent){
            const clients = await Client.find({agentId:_agentId}).populate('userId', 'email');;
            console.log(_agentId);
            if(clients)
            {
                return res.status(200).json({message:"לקוחות הוצאו בהצלחה", clients});
            }else{
                return res.status(404).json({message:"לקוחות לא נמצאו במאגר המידע"});
            }

         }else{
            return res.status(401).json({message:"אין הרשאה להוציא לקוחות ממאגר המידע"});
         }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"חלה שגיאה בהוצאת לקוחות"})
    }
});

router.post('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         const _agentId = req.user.agentId;
         const { email, name, username, password, agentId, credit} = req.body;        
         //Give access to create only if user is admin or its related agent               
         if(isAdmin || agentId === _agentId)
         {
            if (!name || !username || !password || !email) {
                return res.status(400).json({message:"חסרים שדות חיוניים"})
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

                  return res.status(201).json({message:"לקוח חדש נוצר"})
            }
          
         }else{
            return res.status(401).json({message:"אין הרשאה ליצור לקוח חדש"});
         }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:"חלה שגיאה ביצירת לקוח חדש"})
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
    
        return res.status(200).send({ message: 'לקוח לקוח בהצלחה' });
    }else{
        return res.status(401).json({message:"אין הרשאה לחסום לקוח"});
     }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'שגיאה בחסימת הלקוח' });
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
        
            return res.status(200).send({ message: 'הלקוח שוחרר בהצלחה' });
        }else{
            return res.status(401).json({message:"אין הרשאה לשחרר לקוח"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'שגיאה בשחרור הלקוח' });
    }
  });

module.exports = router;