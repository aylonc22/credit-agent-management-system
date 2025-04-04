const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT and return (this is just a placeholder)
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
