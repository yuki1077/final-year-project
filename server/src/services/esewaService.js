const crypto = require('crypto');

// eSewa Test Credentials
const ESEWA_CONFIG = {
  merchantId: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
  secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
  clientId: process.env.ESEWA_CLIENT_ID || 'JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R',
  clientSecret: process.env.ESEWA_CLIENT_SECRET || 'BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==',
  // Use test URL for development, production URL for live
  baseUrl: process.env.ESEWA_BASE_URL || 'https://uat.esewa.com.np',
  // For production: 'https://esewa.com.np'
};

/**
 * Generate eSewa payment URL
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Payment amount
 * @param {string} params.productId - Unique product/service ID
 * @param {string} params.productName - Product name
 * @param {string} params.successUrl - Success callback URL
 * @param {string} params.failureUrl - Failure callback URL
 * @returns {Object} Payment URL and signature
 */
const generatePaymentUrl = ({ amount, productId, productName, successUrl, failureUrl }) => {
  const { merchantId, secretKey, baseUrl } = ESEWA_CONFIG;

  // eSewa requires amount in format: "100.00" (string with 2 decimal places)
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Create signature data
  const signatureData = `total_amount=${formattedAmount},transaction_uuid=${productId},product_code=${merchantId}`;
  
  // Generate signature using SHA256
  const signature = crypto
    .createHash('sha256')
    .update(signatureData)
    .digest('hex');

  // Build payment URL
  const paymentUrl = `${baseUrl}/epay/main`;
  
  // Payment parameters
  const params = {
    amt: formattedAmount,
    psc: 0, // Product/service charge
    pdc: 0, // Product delivery charge
    txAmt: 0, // Tax amount
    tAmt: formattedAmount, // Total amount
    pid: productId, // Product ID (unique transaction ID)
    scd: merchantId, // Service code (merchant ID)
    su: successUrl, // Success URL
    fu: failureUrl, // Failure URL
  };

  return {
    paymentUrl,
    params,
    signature,
  };
};

/**
 * Verify eSewa payment response
 * @param {Object} queryParams - Query parameters from eSewa callback
 * @returns {Object} Verification result
 */
const verifyPayment = (queryParams) => {
  const { secretKey } = ESEWA_CONFIG;
  const { oid, refId, amt } = queryParams;

  // Create signature data for verification
  const signatureData = `total_amount=${amt},transaction_uuid=${oid},product_code=${ESEWA_CONFIG.merchantId}`;
  const expectedSignature = crypto
    .createHash('sha256')
    .update(signatureData)
    .digest('hex');

  // Note: eSewa doesn't send signature in callback, so we verify using refId
  // In production, you should verify with eSewa's verification API
  const isValid = refId && refId !== '';

  return {
    isValid,
    transactionId: oid,
    referenceId: refId,
    amount: parseFloat(amt),
    signature: expectedSignature,
  };
};

/**
 * Verify payment with eSewa API (for production)
 * @param {string} referenceId - Payment reference ID from eSewa
 * @returns {Promise<Object>} Verification result
 */
const verifyPaymentWithAPI = async (referenceId) => {
  const { baseUrl, merchantId, secretKey } = ESEWA_CONFIG;
  
  // This is a placeholder - eSewa verification API endpoint
  // You'll need to check eSewa documentation for the actual verification endpoint
  const verifyUrl = `${baseUrl}/epay/transrec`;
  
  // In production, make an API call to eSewa to verify the transaction
  // For now, we'll return a basic verification
  return {
    isValid: true,
    referenceId,
    verifiedAt: new Date().toISOString(),
  };
};

module.exports = {
  generatePaymentUrl,
  verifyPayment,
  verifyPaymentWithAPI,
  ESEWA_CONFIG,
};








