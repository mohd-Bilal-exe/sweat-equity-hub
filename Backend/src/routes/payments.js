const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

// Create payment intent for job posting
router.post('/create-intent', verifyToken, paymentController.createPaymentIntent);

// Create subscription payment intent
router.post('/create-subscription', verifyToken, paymentController.createSubscription);

// Confirm payment
router.post('/confirm', verifyToken, paymentController.confirmPayment);

// Get payment history for user
router.get('/history/:userId', verifyToken, paymentController.getPaymentHistory);

// Check subscription status
router.get('/subscription/:userId', verifyToken, paymentController.getSubscriptionStatus);

module.exports = router;