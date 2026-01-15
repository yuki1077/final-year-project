const { createPaymentIntent } = require('../services/stripeService');
const { generatePaymentUrl, verifyPayment } = require('../services/esewaService');
const { notifyPaymentSuccess } = require('../services/notificationService');

const createIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const intent = await createPaymentIntent({
      amount: Math.round(Number(amount) * 100),
      metadata: { userId: req.user.id },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    next(error);
  }
};

const createEsewaPayment = async (req, res, next) => {
  try {
    const { amount, orderId, items } = req.body;
    const userId = req.user.id;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and orderId are required' });
    }

    // Generate unique product ID (transaction UUID)
    const productId = `ORDER-${orderId}-${Date.now()}`;
    const productName = items?.map(item => item.bookTitle).join(', ') || 'Educational Books';

    // Get base URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Generate payment URL
    const paymentData = generatePaymentUrl({
      amount,
      productId,
      productName,
      successUrl: `${baseUrl}/api/payments/esewa/success?orderId=${orderId}&userId=${userId}`,
      failureUrl: `${baseUrl}/api/payments/esewa/failure?orderId=${orderId}&userId=${userId}`,
    });

    res.json({
      paymentUrl: paymentData.paymentUrl,
      params: paymentData.params,
      signature: paymentData.signature,
    });
  } catch (error) {
    next(error);
  }
};

const handleEsewaSuccess = async (req, res, next) => {
  try {
    const { orderId, userId } = req.query;
    const paymentData = verifyPayment(req.query);

    if (!paymentData.isValid) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/school/cart?payment=failed`);
    }

    // Update order payment status
    const { updateOrderStatus } = require('../services/orderService');
    const order = await updateOrderStatus(orderId, 'confirmed', 'completed');
    
    // Create notification for payment success
    if (userId && order) {
      await notifyPaymentSuccess(userId, orderId, order.total);
    }

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/school/orders?payment=success&orderId=${orderId}`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

const handleEsewaFailure = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/school/cart?payment=failed&orderId=${orderId}`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIntent,
  createEsewaPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
};

