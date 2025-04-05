const express = require('express');
const User = require('../../models/User');
const { decryptAES } = require('../../utils/hashPassword');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.post('/',async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
       
      if (!user || password !== await decryptAES(user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log("Trying to generate jwt token");
      const token = generateToken({id: user._id, email: user.email, role: user.role});
      console.log("Jwt token generated succeffuly");
           
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
