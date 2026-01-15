const express = require('express');
const authRoutes = require('./authRoutes');
const bookRoutes = require('./bookRoutes');
const orderRoutes = require('./orderRoutes');
const userRoutes = require('./userRoutes');
const paymentRoutes = require('./paymentRoutes');
const progressRoutes = require('./progressRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/progress', progressRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;

