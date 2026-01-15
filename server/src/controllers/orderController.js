const {
  getAllOrders,
  getOrdersBySchool,
  getOrdersByPublisher,
  createOrder,
  updateOrderStatus,
} = require('../services/orderService');
const { sendOrderConfirmationEmail, sendNewOrderNotificationToPublisher, sendOrderStatusUpdateEmail } = require('../services/emailService');
const { findUserById } = require('../services/userService');
const { getBookById } = require('../services/bookService');
const { notifyNewOrder, notifyOrderStatusChange } = require('../services/notificationService');

const listOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'school') {
      orders = await getOrdersBySchool(req.user.id);
    } else if (req.user.role === 'publisher') {
      orders = await getOrdersByPublisher(req.user.id);
    } else {
      orders = await getAllOrders();
    }
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const createNewOrder = async (req, res, next) => {
  try {
    const { items, total, paymentStatus } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = await createOrder({
      schoolId: req.user.id,
      schoolName: req.user.email,
      total,
      items,
      paymentStatus,
    });

    // Send confirmation email to school
    const school = await findUserById(req.user.id);
    if (school) {
      sendOrderConfirmationEmail({
        to: school.email,
        name: school.name,
        orderId: order.id,
        total: order.total,
        items: order.items.map(item => ({
          bookTitle: item.bookTitle,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }

    // Send notification to publishers
    const publisherMap = new Map();
    for (const item of order.items) {
      const book = await getBookById(item.bookId);
      if (book && book.publisherId) {
        if (!publisherMap.has(book.publisherId)) {
          publisherMap.set(book.publisherId, []);
        }
        publisherMap.get(book.publisherId).push({
          bookTitle: item.bookTitle,
          quantity: item.quantity,
        });
      }
    }

    for (const [publisherId, publisherItems] of publisherMap) {
      const publisher = await findUserById(publisherId);
      if (publisher) {
        sendNewOrderNotificationToPublisher({
          to: publisher.email,
          publisherName: publisher.organizationName || publisher.name,
          orderId: order.id,
          schoolName: school.organizationName || school.name,
          items: publisherItems,
        });
        
        // Create notification for publisher
        await notifyNewOrder(
          publisherId,
          order.id,
          school.organizationName || school.name,
          order.total
        );
      }
    }

    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
};

const changeOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await updateOrderStatus(req.params.id, status, paymentStatus);
    
    // Send status update email to school and create notification
    if (order && order.schoolId && status) {
      const school = await findUserById(order.schoolId);
      if (school) {
        sendOrderStatusUpdateEmail({
          to: school.email,
          name: school.name,
          orderId: order.id,
          status: status,
        });
        
        // Create notification for school
        await notifyOrderStatusChange(order.schoolId, order.id, status);
      }
    }
    
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listOrders,
  createNewOrder,
  changeOrderStatus,
};

