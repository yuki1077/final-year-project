const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL connection established');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
};

