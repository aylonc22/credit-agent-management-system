const express = require('express');
const Transaction = require('../../models/Transaction'); // make sure path is correct
const Client = require('../../models/Client');
const crypto = require('crypto');
const router = express.Router();


function cleanAndSortParams(obj) {
  // Step 1: Remove unwanted keys and empty values
  const cleaned = Object.entries(obj)
    .filter(([key, value]) => 
      value !== null && 
      value !== undefined && 
      value !== '' &&
      key !== 'signature' &&
      key !== 'newSignature'
    );

  // Step 2: Sort by key
  const sorted = cleaned.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  // Step 3: Turn back into an object
  return Object.fromEntries(sorted);
}

// Function to calculate HMAC SHA256 and encode to Base64
function signCheck(content, secretkey) {
  const hmac = crypto.createHmac('sha256', secretkey);
  hmac.update(content);
  return hmac.digest('base64');
}

router.post('/', async (req, res) => {
    try {
      const body = req.body;
      console.log(body);     

      if (!req.body?.merchantOrderNo || !req.body?.status || !req.body.newSignature) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      const {merchantOrderNo, status, newSignature, cryptoAmountInUSDT} = req.body;

      const cleanedAndSorted = cleanAndSortParams(body);
      const timestamp = req.headers['timestamp'];  // Retrieving timestamp from headers
      const method = req.method;
      const callbackUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

      const content = timestamp + method + callbackUrl + JSON.stringify(cleanedAndSorted);

      // The secret key for HMAC signing
      const secretkey = process.env.APP_SECRET;
      const sign = signCheck(content, secretkey);

      if(sign !== newSignature){
        console.log('sign',sign);
        console.log('newSignature',newSignature);
        return res.status(401).json({message:"signatures dont match!"});
      }

      // Find the transaction by the provided "transactionId" (the one you sent in the callback)
      const transaction = await Transaction.findOne({merchantOrderNo:merchantOrderNo});
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  

      // Update the status to 'completed' if the payment is successful (you can add more checks here if needed)
      switch (status) {
        case 'PAY_SUCCESS':
         return; // we need only pay fail to fail the transaction or finish to complete the transaction
          break;
        case 'PAY_FAIL':
          transaction.status = 'failed';
          break;
        case 'FINISHED':
          transaction.status = 'completed';
          break;
        default:
          console.log(status + ' is not supported webokhook');
          return res.status(400).json({message:"status not supported"});
      }
    
      if(transaction.status === 'completed'){
        const client = await Client.findById(transaction.client);
        transaction.amount_paid = transaction.amount_paid + cryptoAmountInUSDT;
        client.credit = client.credit + cryptoAmountInUSDT;
        await client.save();
      }

      // Save the updated transaction
      await transaction.save();
  
      // Respond with success
      return res.status(200).json({
        message: 'Transaction updated successfully',
        transaction: transaction,
      });
    } catch (err) {
      console.error('Error handling callback:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
  
