const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const initDb = async () => {
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  });

  try {
    console.log('Running database migrations...');
    await connection.query(schemaSQL);
    console.log('✅ Database tables ensured.');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
};

initDb();

