const { pool } = require('../config/db');

const mapFeedback = (row) => ({
  id: String(row.id),
  schoolId: String(row.school_id),
  schoolName: row.school_name,
  publisherId: String(row.publisher_id),
  publisherName: row.publisher_name,
  message: row.message,
  createdAt: row.created_at,
});

const createFeedback = async ({ schoolId, schoolName, publisherId, publisherName, message }) => {
  const [result] = await pool.query(
    `INSERT INTO feedback (school_id, school_name, publisher_id, publisher_name, message)
     VALUES (?, ?, ?, ?, ?)`,
    [schoolId, schoolName, publisherId, publisherName, message]
  );
  return getFeedbackById(result.insertId);
};

const getFeedbackById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM feedback WHERE id = ?', [id]);
  return rows[0] ? mapFeedback(rows[0]) : null;
};

const getFeedbackForPublisher = async (publisherId) => {
  const [rows] = await pool.query(
    'SELECT * FROM feedback WHERE publisher_id = ? ORDER BY created_at DESC',
    [publisherId]
  );
  return rows.map(mapFeedback);
};

const getFeedbackForSchool = async (schoolId) => {
  const [rows] = await pool.query(
    'SELECT * FROM feedback WHERE school_id = ? ORDER BY created_at DESC',
    [schoolId]
  );
  return rows.map(mapFeedback);
};

const getAllFeedback = async () => {
  const [rows] = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
  return rows.map(mapFeedback);
};

module.exports = {
  createFeedback,
  getFeedbackForPublisher,
  getFeedbackForSchool,
  getAllFeedback,
};

