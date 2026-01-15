const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification
} = require('../controllers/notificationController');

// All routes require authentication
router.use(authMiddleware);

// Get all notifications for the current user
router.get('/', fetchNotifications);

// Get unread notification count
router.get('/unread-count', fetchUnreadCount);

// Mark a notification as read
router.patch('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllNotificationsAsRead);

// Delete a notification
router.delete('/:id', removeNotification);

module.exports = router;


