const { errorResponse } = require('../utils/responseFormatter');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';
  
  // Format specific known errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation Error', err.errors, 400);
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return errorResponse(res, 'Resource not found', null, 404);
  }

  // Hide stack trace in production
  const errorDetails = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  
  errorResponse(res, message, errorDetails, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
