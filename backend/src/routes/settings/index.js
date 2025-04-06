const express = require('express');
const router = express.Router();

router.use('/settings', require('./general'));

module.exports = router;