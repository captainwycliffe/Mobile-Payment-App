const { db } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS, TRANSACTION_STATUS } = require('../utils/constants');
const { logger } = require('../utils/logger');
const { triggerWebhook } = require('../services/webhookService');

const sendPayment = async (req, res) => {
  try {
    const { recipient, amount, currency } = req.body;
    const userId = req.user.id;

    // Simulate payment processing logic
    const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate
    const status = isPaymentSuccessful ? TRANSACTION_STATUS.COMPLETED : TRANSACTION_STATUS.FAILED;

    if (isPaymentSuccessful) {
      // Insert transaction into database
      db.run(
        'INSERT INTO transactions (user_id, recipient, amount, currency, status) VALUES (?, ?, ?, ?, ?)',
        [userId, recipient, amount, currency, status],
        async function(err) {
          if (err) {
            logger.error('Error saving transaction:', err);
            return errorResponse(res, 'Failed to process payment', HTTP_STATUS.INTERNAL_SERVER_ERROR);
          }

          const transactionId = this.lastID;

          // Trigger webhook (bonus feature)
          try {
            await triggerWebhook({
              transactionId,
              userId,
              recipient,
              amount,
              currency,
              status,
              timestamp: new Date().toISOString()
            });
          } catch (webhookError) {
            logger.warn('Webhook failed but payment succeeded:', webhookError);
          }

          logger.info(`Payment processed successfully: ${transactionId} for user ${userId}`);

          return successResponse(res, {
            transaction: {
              id: transactionId,
              recipient,
              amount: parseFloat(amount),
              currency,
              status,
              timestamp: new Date().toISOString()
            }
          }, 'Payment sent successfully', HTTP_STATUS.CREATED);
        }
      );
    } else {
      // Payment failed
      logger.warn(`Payment failed for user ${userId}: ${recipient} - ${amount} ${currency}`);
      
      return errorResponse(res, 'Payment processing failed. Please try again.', HTTP_STATUS.BAD_REQUEST);
    }
  } catch (error) {
    logger.error('Send payment error:', error);
    return errorResponse(res, 'Payment processing failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  sendPayment
};