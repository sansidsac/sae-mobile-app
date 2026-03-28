const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @desc    Get API health status
 * @route   GET /api/v1/health
 * @access  Public
 */
exports.getHealth = (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    const healthData = {
      server: 'Running',
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    
    return successResponse(res, 'System Health OK', healthData, 200);
  } catch (error) {
    return errorResponse(res, 'Health Check Failed', error.message, 500);
  }
};
