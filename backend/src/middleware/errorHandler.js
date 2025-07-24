const { logger } = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return errorResponse(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `${field} already exists`, HTTP_STATUS.CONFLICT);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
  }

  // Default error
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

module.exports = { errorHandler };