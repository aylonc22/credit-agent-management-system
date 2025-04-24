const express = require('express');
const autheMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../../models/Transaction');
const router = express.Router();

router.get('/', autheMiddleware ,async (req, res) => {
    try{
         const isAdmin = req.user.role === 'admin';
         const isAgent = req.user.role === 'agent';
         const isMaster = req.user.role ==='master-agent';
         const _agentId = req.user.agentId;
         let clientIds = [];
        
         if(isAdmin)
         {
            const transactions = await Transaction.find().populate("client","name").populate("agent",'name');
            
            if(transactions)
            {
                return res.status(200).json({message:"עסקאות הוצאו בהצלחה", transactions});
            }else{
                return res.status(404).json({message:"עסקאות לא נמצאו במאגר המידע"});
            }
         }else if(isMaster){
            if (req.query.clients) {
                try {
                  clientIds.push(...JSON.parse(req.query.clients));                       
                } catch (e) {
                  return res.status(400).json({ message: 'Invalid agents array' });
                }
              }            
            const transactions = await Transaction.find({
                client: { $in: clientIds }
              }).populate("client","name").populate("agent",'name');            
                         
            if(transactions)
            {                
                return res.status(200).json({message:"עסקאות הוצאו בהצלחה", transactions});
            }else{
                return res.status(404).json({message:"עסקאות לא נמצאו במאגר המידע"});
            }

         }else if(isAgent){
            const transactions = await Transaction.find({agent:_agentId}).populate("client","name").populate("agent",'name');;           
            if(transactions)
            {
                return res.status(200).json({message:"לקוחות הוצאו בהצלחה", transactions});
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


module.exports = router;
