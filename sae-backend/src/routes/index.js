const express = require('express');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

// Export router
module.exports = router;
