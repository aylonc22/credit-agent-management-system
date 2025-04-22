const express = require('express');
const Transaction = require('../../models/Transaction'); // make sure path is correct
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const { transactionId, value_coin} = req.query;
  
      if (!transactionId || !value_coin ) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }
  
      // Find the transaction by the provided "transactionId" (the one you sent in the callback)
      const transaction = await Transaction.findById(transactionId);
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Update the transaction with the payment data     
      transaction.amount_paid = value_coin;  // Store the amount paid     
  
      // Update the status to 'completed' if the payment is successful (you can add more checks here if needed)
      transaction.status = 'completed';
  
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
  
  module.exports = router;
