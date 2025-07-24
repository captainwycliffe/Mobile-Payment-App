const { verifyToken } = require('../config/jwt');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return errorResponse(res, 'Access token required', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
    } else if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
    } else {
      return errorResponse(res, 'Token verification failed', HTTP_STATUS.UNAUTHORIZED);
    }
  }
};

module.exports = { authenticateToken };
