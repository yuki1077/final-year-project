const { pool } = require('../config/db');

const mapUser = (row) => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  role: row.role,
  status: row.status,
  organizationName: row.organization_name,
  documentUrl: row.document_url,
  profileImage: row.profile_image,
  createdAt: row.created_at,
});

const findAuthByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, status, organization_name, document_url, profile_image, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] ? mapUser(rows[0]) : null;
};

const createUser = async ({
  name,
  email,
  password,
  role,
  organizationName,
  phone,
  status,
  documentUrl,
}) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, organization_name, phone, status, document_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      password,
      role,
      organizationName || null,
      phone || null,
      status || 'pending',
      documentUrl || null,
    ]
  );
  return findUserById(result.insertId);
};

const getAllUsers = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, status, organization_name, document_url, profile_image, created_at FROM users ORDER BY created_at DESC'
  );
  return rows.map(mapUser);
};

const getPublishers = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, status, organization_name, document_url, profile_image, created_at
     FROM users
     WHERE role = 'publisher'
     ORDER BY created_at DESC`
  );
  return rows.map(mapUser);
};

const updateUserStatus = async (id, status) => {
  await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
  return findUserById(id);
};

const updateProfileImage = async (id, profileImage) => {
  await pool.query('UPDATE users SET profile_image = ? WHERE id = ?', [profileImage, id]);
  return findUserById(id);
};

const updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  return findUserById(id);
};

module.exports = {
  findAuthByEmail,
  findUserById,
  createUser,
  getAllUsers,
  getPublishers,
  updateUserStatus,
  updateProfileImage,
  updatePassword,
};

