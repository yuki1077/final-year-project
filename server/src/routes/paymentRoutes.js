const express = require('express');
const { createIntent, createEsewaPayment, handleEsewaSuccess, handleEsewaFailure } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe payment
router.post('/intent', authMiddleware, createIntent);

// eSewa payment
router.post('/esewa/create', authMiddleware, createEsewaPayment);
router.get('/esewa/success', handleEsewaSuccess);
router.get('/esewa/failure', handleEsewaFailure);

module.exports = router;

