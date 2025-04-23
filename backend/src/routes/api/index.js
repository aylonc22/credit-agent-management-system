const express = require('express');
const router = express.Router();

router.use('/stats', require('./stats'));
router.use('/agent', require('./agent'));
router.use('/client', require('./client'));
router.use('/transaction', require('./transaction'));
router.use('/create-inovice', require('./create-inovice'));
router.use('/payment-callback', require('./payment-callback'));

module.exports = router;