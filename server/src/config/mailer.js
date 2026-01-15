const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('📧 Email service ready');
  } catch (error) {
    console.warn('⚠️  Email service verification failed:', error.message);
  }
};

module.exports = {
  transporter,
  verifyTransporter,
};

