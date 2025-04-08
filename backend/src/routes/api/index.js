const express = require('express');
const router = express.Router();

router.use('/stats', require('./stats'));
router.use('/agent', require('./agent'));
router.use('/client', require('./client'));

module.exports = router;