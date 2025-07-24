const { db } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');
const { logger } = require('../utils/logger');

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    db.all(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC',
      [userId],
      (err, transactions) => {
        if (err) {
          logger.error('Database error fetching transactions:', err);
          return errorResponse(res, 'Failed to fetch transactions', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        // Format transactions for frontend
        const formattedTransactions = transactions.map(transaction => ({
          id: transaction.id,
          recipient: transaction.recipient,
          amount: parseFloat(transaction.amount),
          currency: transaction.currency,
          status: transaction.status,
          timestamp: transaction.timestamp
        }));

        logger.info(`Fetched ${transactions.length} transactions for user ${userId}`);

        return successResponse(res, {
          transactions: formattedTransactions,
          count: transactions.length
        }, 'Transactions retrieved successfully');
      }
    );
  } catch (error) {
    logger.error('Get transactions error:', error);
    return errorResponse(res, 'Failed to fetch transactions', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getTransactions
};