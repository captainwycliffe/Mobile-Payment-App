const Joi = require('joi');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS, USER_ROLES, CURRENCIES } = require('../utils/constants');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...Object.values(USER_ROLES)).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const sendPaymentSchema = Joi.object({
  recipient: Joi.string().min(2).max(100).required(),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().valid(...CURRENCIES).required()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return errorResponse(res, 'Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
    }
    next();
  };
};

module.exports = {
  validateSignup: validateRequest(signupSchema),
  validateLogin: validateRequest(loginSchema),
  validateSendPayment: validateRequest(sendPaymentSchema)
};