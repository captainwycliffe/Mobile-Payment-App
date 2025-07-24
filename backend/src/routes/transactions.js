const express = require('express');
const { getTransactions } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', authenticateToken, getTransactions);

module.exports = router;