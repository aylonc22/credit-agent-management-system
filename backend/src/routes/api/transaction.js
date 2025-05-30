const express = require('express');
const autheMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../../models/Transaction');
const Client = require('../../models/Client');
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

router.put('/:transactionId',autheMiddleware ,async (req, res) => {
  try{   
    const {transactionId} = req.params;
    if(req.user.role === 'admin'){
            const transaction = await Transaction.findById(transactionId);
            if(transaction){
                transaction.status = 'completed';               
                await transaction.save();

                const client = await Client.findById(transaction.client);
                client.credit = client.credit + transaction.amount;                
                await client.save();

                return res.status(200).json({message:"עסקה אושרה בהצלחה"});
            }
            return res.status(404).json({message:"עסקה לא נמצאה"});
    }
    else{
        return res.status(403).json({message:"אין הרשאה לאישור עסקה"})
    }
  }
  catch(e){
        console.log(e);
        return res.status(500).json({message:"משהו השתבש בעת אישור העסקה"});
  }
})


module.exports = router;
