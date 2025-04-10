const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/change-password', require('./change-password'));
router.use('/generate-link', require('./generate-link'));
router.use('/enable-2fa',require('./enable-2fa').router);
router.use('/disable-2fa',require('./disable-2fa'));
router.use('/verify-2fa',require('./verify-2fa'));
router.use('/resend-2fa',require('./resend-2fa'));

module.exports = router;