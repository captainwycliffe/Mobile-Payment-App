const axios = require('axios');
const { logger } = require('../utils/logger');

const triggerWebhook = async (transactionData) => {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  if (!webhookUrl) {
    logger.warn('No webhook URL configured, skipping webhook trigger');
    return;
  }

  try {
    const payload = {
      event: 'payment.completed',
      data: transactionData,
      timestamp: new Date().toISOString(),
      source: 'mobile-payment-app'
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MobilePaymentApp/1.0'
      },
      timeout: 5000 // 5 second timeout
    });

    logger.info(`Webhook triggered successfully: ${response.status} - ${transactionData.transactionId}`);
    return response.data;
  } catch (error) {
    logger.error('Webhook trigger failed:', {
      error: error.message,
      transactionId: transactionData.transactionId,
      webhookUrl: webhookUrl
    });
    throw error;
  }
};

module.exports = {
  triggerWebhook
};