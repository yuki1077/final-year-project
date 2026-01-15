const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');
const { testConnection } = require('./config/db');
const { verifyTransporter } = require('./config/mailer');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();
    await verifyTransporter();

    app.listen(PORT, () => {
      console.log(`🚀 EduConnect API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

