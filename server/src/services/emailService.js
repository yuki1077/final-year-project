const { transporter } = require('../config/mailer');

const sendRegistrationEmail = async ({ to, name, role }) => {
  if (!to) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to EduConnect',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Welcome to EduConnect!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering as a <strong>${role}</strong> on EduConnect.</p>
          <p>We will notify you once your account is reviewed.</p>
          <p>Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send registration email:', error.message);
  }
};

const sendApprovalEmail = async ({ to, name, status }) => {
  if (!to) return;

  const isApproved = status === 'approved';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: isApproved ? 'Account Approved - EduConnect' : 'Account Status Update - EduConnect',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: ${isApproved ? '#10b981' : '#ef4444'};">
            Account ${isApproved ? 'Approved' : 'Status Update'}
          </h2>
          <p>Hi ${name},</p>
          ${isApproved 
            ? `<p>Great news! Your account has been <strong>approved</strong>. You can now log in and start using EduConnect.</p>
               <p><a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login Now</a></p>`
            : `<p>Your account status has been updated to: <strong>${status}</strong>.</p>
               <p>If you have any questions, please contact our support team.</p>`
          }
          <p>Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send approval email:', error.message);
  }
};

const sendOrderConfirmationEmail = async ({ to, name, orderId, total, items }) => {
  if (!to) return;

  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.bookTitle}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">NPR ${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">NPR ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Order Confirmation #${orderId} - EduConnect`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Order Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your order. Your order <strong>#${orderId}</strong> has been confirmed.</p>
          
          <h3 style="margin-top: 20px;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding: 10px; text-align: left;">Book</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #3b82f6;">
            <h3 style="margin: 0;">Total: NPR ${total.toFixed(2)}</h3>
          </div>
          
          <p style="margin-top: 30px;">You can track your order status in your dashboard.</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/school/orders" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Order</a></p>
          
          <p style="margin-top: 30px;">Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send order confirmation email:', error.message);
  }
};

const sendNewOrderNotificationToPublisher = async ({ to, publisherName, orderId, schoolName, items }) => {
  if (!to) return;

  const itemsList = items.map(item => 
    `<li style="padding: 5px 0;">${item.bookTitle} - Quantity: ${item.quantity}</li>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `New Order Received #${orderId} - EduConnect`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #10b981;">New Order Received!</h2>
          <p>Hi ${publisherName},</p>
          <p>You have received a new order from <strong>${schoolName}</strong>.</p>
          
          <h3 style="margin-top: 20px;">Order #${orderId}</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${itemsList}
          </ul>
          
          <p style="margin-top: 30px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/publisher/orders" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">View Order Details</a></p>
          
          <p style="margin-top: 30px;">Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send publisher notification email:', error.message);
  }
};

const sendPasswordChangeConfirmation = async ({ to, name }) => {
  if (!to) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Changed - EduConnect',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Password Changed Successfully</h2>
          <p>Hi ${name},</p>
          <p>Your password has been changed successfully.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
          <p style="margin-top: 30px;">Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send password change email:', error.message);
  }
};

const sendOrderStatusUpdateEmail = async ({ to, name, orderId, status }) => {
  if (!to) return;

  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being processed.',
    delivered: 'Your order has been delivered successfully!',
    cancelled: 'Your order has been cancelled.',
  };

  const statusColors = {
    confirmed: '#3b82f6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Order #${orderId} Status Update - EduConnect`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: ${statusColors[status] || '#3b82f6'};">Order Status Updated</h2>
          <p>Hi ${name},</p>
          <p>${statusMessages[status] || `Your order status has been updated to: ${status}`}</p>
          <p>Order ID: <strong>#${orderId}</strong></p>
          
          <p style="margin-top: 30px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/school/orders" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">View Order</a></p>
          
          <p style="margin-top: 30px;">Best regards,<br/><strong>EduConnect Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('⚠️  Unable to send order status email:', error.message);
  }
};

module.exports = {
  sendRegistrationEmail,
  sendApprovalEmail,
  sendOrderConfirmationEmail,
  sendNewOrderNotificationToPublisher,
  sendPasswordChangeConfirmation,
  sendOrderStatusUpdateEmail,
};

