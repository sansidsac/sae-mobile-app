const express = require('express');
const eventRoutes = require('./eventRoutes');

const router = express.Router();

router.use('/', eventRoutes);

module.exports = router;
