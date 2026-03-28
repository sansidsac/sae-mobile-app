/**
 * Formats a successful response
 */
const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Formats an error response
 */
const errorResponse = (res, message, error = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
  };

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
