const { pool } = require('../config/db');

const mapEntry = (row) => ({
  id: String(row.id),
  schoolId: String(row.school_id),
  schoolName: row.school_name,
  bookId: String(row.book_id),
  bookTitle: row.book_title,
  status: row.status,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getEntryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM progress_entries WHERE id = ?', [id]);
  return rows[0] ? mapEntry(rows[0]) : null;
};

const getEntriesBySchool = async (schoolId) => {
  const [rows] = await pool.query(
    'SELECT * FROM progress_entries WHERE school_id = ? ORDER BY updated_at DESC',
    [schoolId]
  );
  return rows.map(mapEntry);
};

const createEntry = async ({ schoolId, schoolName, bookId, bookTitle, status, description }) => {
  const [result] = await pool.query(
    `INSERT INTO progress_entries (school_id, school_name, book_id, book_title, status, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [schoolId, schoolName, bookId, bookTitle, status, description || null]
  );
  return getEntryById(result.insertId);
};

const updateEntry = async (id, payload) => {
  const fields = [];
  const values = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  if (!fields.length) return getEntryById(id);
  values.push(id);
  await pool.query(`UPDATE progress_entries SET ${fields.join(', ')} WHERE id = ?`, values);
  return getEntryById(id);
};

const deleteEntry = async (id) => {
  await pool.query('DELETE FROM progress_entries WHERE id = ?', [id]);
};

const getEntriesByPublisher = async (publisherId) => {
  const [rows] = await pool.query(
    `SELECT pe.* FROM progress_entries pe
     INNER JOIN books b ON pe.book_id = b.id
     WHERE b.publisher_id = ?
     ORDER BY pe.updated_at DESC`,
    [publisherId]
  );
  return rows.map(mapEntry);
};

module.exports = {
  mapEntry,
  getEntryById,
  getEntriesBySchool,
  getEntriesByPublisher,
  createEntry,
  updateEntry,
  deleteEntry,
};

