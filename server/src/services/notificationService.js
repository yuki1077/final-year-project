const { pool } = require('../config/db');

const createNotification = async (userId, type, title, message, link = null) => {
  const query = `
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(query, [userId, type, title, message, link]);
  return result.insertId;
};

const getUserNotifications = async (userId, limit = 50) => {
  const query = `
    SELECT 
      id,
      user_id,
      type,
      title,
      message,
      is_read,
      link,
      created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `;
  
  const [rows] = await pool.execute(query, [userId, limit]);
  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    isRead: Boolean(row.is_read),
    link: row.link,
    createdAt: row.created_at
  }));
};

const getUnreadCount = async (userId) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ? AND is_read = FALSE
  `;
  
  const [rows] = await pool.execute(query, [userId]);
  return rows[0].count;
};

const markAsRead = async (notificationId, userId) => {
  const query = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ? AND user_id = ?
  `;
  
  await pool.execute(query, [notificationId, userId]);
};

const markAllAsRead = async (userId) => {
  const query = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = ? AND is_read = FALSE
  `;
  
  await pool.execute(query, [userId]);
};

const deleteNotification = async (notificationId, userId) => {
  const query = `
    DELETE FROM notifications
    WHERE id = ? AND user_id = ?
  `;
  
  await pool.execute(query, [notificationId, userId]);
};

// Notification creators for common events
const notifyNewOrder = async (publisherId, orderId, schoolName, total) => {
  return await createNotification(
    publisherId,
    'order',
    'New Order Received',
    `${schoolName} has placed a new order worth $${total}`,
    `/publisher/orders`
  );
};

const notifyOrderStatusChange = async (schoolId, orderId, status) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  };
  
  return await createNotification(
    schoolId,
    'status_change',
    'Order Status Update',
    statusMessages[status] || `Your order status has been updated to ${status}`,
    `/school/orders`
  );
};

const notifyAccountApproval = async (userId, status) => {
  const title = status === 'approved' ? 'Account Approved!' : 'Account Rejected';
  const message = status === 'approved' 
    ? 'Your account has been approved. You can now access all features.'
    : 'Your account has been rejected. Please contact support for more information.';
  
  return await createNotification(
    userId,
    'approval',
    title,
    message,
    status === 'approved' ? '/dashboard' : null
  );
};

const notifyPaymentSuccess = async (userId, orderId, amount) => {
  return await createNotification(
    userId,
    'payment',
    'Payment Successful',
    `Your payment of $${amount} has been processed successfully`,
    `/school/orders`
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyNewOrder,
  notifyOrderStatusChange,
  notifyAccountApproval,
  notifyPaymentSuccess
};

