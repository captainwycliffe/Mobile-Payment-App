const express = require('express');
const { sendPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');
const { validateSendPayment } = require('../middleware/validation');

const router = express.Router();

router.post('/send', authenticateToken, validateSendPayment, sendPayment);

module.exports = router;
