const { pool } = require('../config/db');

const mapOrder = (row) => ({
  id: String(row.id),
  schoolId: String(row.school_id),
  schoolName: row.school_name,
  total: Number(row.total),
  status: row.status,
  paymentStatus: row.payment_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  items: [],
});

const mapOrderItem = (row) => ({
  orderId: String(row.order_id),
  bookId: String(row.book_id),
  bookTitle: row.book_title,
  quantity: row.quantity,
  price: Number(row.price),
});

const attachOrderItems = async (orders) => {
  if (!orders.length) return orders;
  const orderIds = orders.map((order) => order.id);
  const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds]);
  const itemsMap = {};
  rows.forEach((row) => {
    const item = mapOrderItem(row);
    if (!itemsMap[item.orderId]) {
      itemsMap[item.orderId] = [];
    }
    itemsMap[item.orderId].push({
      bookId: item.bookId,
      bookTitle: item.bookTitle,
      quantity: item.quantity,
      price: item.price,
    });
  });

  return orders.map((order) => ({
    ...order,
    items: itemsMap[order.id] || [],
  }));
};

const getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  const orders = rows.map(mapOrder);
  return attachOrderItems(orders);
};

const getOrdersBySchool = async (schoolId) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE school_id = ? ORDER BY created_at DESC', [
    schoolId,
  ]);
  const orders = rows.map(mapOrder);
  return attachOrderItems(orders);
};

const getOrdersByPublisher = async (publisherId) => {
  const [rows] = await pool.query(
    `SELECT DISTINCT o.*
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN books b ON oi.book_id = b.id
     WHERE b.publisher_id = ?
     ORDER BY o.created_at DESC`,
    [publisherId]
  );
  const orders = rows.map(mapOrder);
  return attachOrderItems(orders);
};

const createOrder = async ({ schoolId, schoolName, total, status, paymentStatus, items }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (school_id, school_name, total, status, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [schoolId, schoolName, total, status || 'pending', paymentStatus || 'pending']
    );

    const orderId = orderResult.insertId;

    if (Array.isArray(items)) {
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, book_id, book_title, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.bookId, item.bookTitle, item.quantity, item.price]
        );
      }
    }

    await connection.commit();
    const newOrder = mapOrder({
      id: orderId,
      school_id: schoolId,
      school_name: schoolName,
      total,
      status: status || 'pending',
      payment_status: paymentStatus || 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });
    newOrder.items = items || [];
    return newOrder;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateOrderStatus = async (id, status, paymentStatus) => {
  await pool.query('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', [
    status,
    paymentStatus,
    id,
  ]);
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
  if (!rows[0]) return null;
  const [itemsRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
  return {
    ...mapOrder(rows[0]),
    items: itemsRows.map((row) => ({
      bookId: String(row.book_id),
      bookTitle: row.book_title,
      quantity: row.quantity,
      price: Number(row.price),
    })),
  };
};

module.exports = {
  getAllOrders,
  getOrdersBySchool,
  getOrdersByPublisher,
  createOrder,
  updateOrderStatus,
};

