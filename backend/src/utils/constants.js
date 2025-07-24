const USER_ROLES = {
    PSP: 'psp',
    DEV: 'dev'
  };
  
  const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  const TRANSACTION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  };
  
  const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  };
  
  module.exports = {
    USER_ROLES,
    CURRENCIES,
    TRANSACTION_STATUS,
    HTTP_STATUS
  };