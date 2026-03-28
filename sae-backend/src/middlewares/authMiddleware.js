const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseFormatter');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return errorResponse(res, 'Not authorized, user not found', null, 401);
      }

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return errorResponse(res, 'Not authorized, token failed', error.message, 401);
    }
  } else {
    return errorResponse(res, 'Not authorized, no token', null, 401);
  }
};

module.exports = { protect };
