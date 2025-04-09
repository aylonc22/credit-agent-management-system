const express = require('express');
const { route } = require('./enable-2fa');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/change-password', require('./change-password'));
router.use('/generate-link', require('./generate-link'));
router.use('/enable-2fa',require('./enable-2fa'));
router.use('/verify-2fa',require('./verify-2fa'));

module.exports = router;