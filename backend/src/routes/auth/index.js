const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/change-password', require('./change-password'));

module.exports = router;