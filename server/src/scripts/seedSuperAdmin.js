const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'superadmin@educonnect.com';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Admin';

const seedSuperAdmin = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  });

  try {
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [SUPER_ADMIN_EMAIL]);
    if (existing.length) {
      console.log('ℹ️  Super admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
    await connection.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES (?, ?, ?, 'admin', 'approved')`,
      [SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, hashedPassword]
    );

    console.log(`✅ Super admin created (${SUPER_ADMIN_EMAIL})`);
  } catch (error) {
    console.error('❌ Failed to seed super admin:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
};

seedSuperAdmin();

