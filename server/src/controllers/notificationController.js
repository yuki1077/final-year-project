const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../services/notificationService');

const fetchNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    
    const notifications = await getUserNotifications(userId, limit);
    const unreadCount = await getUnreadCount(userId);
    
    res.json({
      data: notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

const fetchUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await getUnreadCount(userId);
    
    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await markAsRead(id, userId);
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    await markAllAsRead(userId);
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

const removeNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await deleteNotification(id, userId);
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification
};


