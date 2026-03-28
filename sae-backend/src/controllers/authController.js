const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation Error', errors.array(), 400);
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 'User already exists', null, 400);
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    return successResponse(res, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token
    }, 201);
  } catch (error) {
    return errorResponse(res, 'Server Error logging in', error.message, 500);
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation Error', errors.array(), 400);
    }

    const { email, password } = req.body;

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', null, 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', null, 401);
    }

    const token = generateToken(user._id);

    return successResponse(res, 'Login successful', {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,     
      token
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Server Error during login', error.message, 500);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return successResponse(res, 'User data retrieved', user, 200);
  } catch (error) {
    return errorResponse(res, 'Server Error fetching profile', error.message, 500);
  }
};
