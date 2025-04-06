const express = require('express');
const router = express.Router();

router.use('/general', require('./general'));

module.exports = router;