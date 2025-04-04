const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  // Registration logic here
  res.send({ message: 'User registered successfully' });
});

module.exports = router;
