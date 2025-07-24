const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };
  
  const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };