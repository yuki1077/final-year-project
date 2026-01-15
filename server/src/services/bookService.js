const { pool } = require('../config/db');

const mapBook = (row) => ({
  id: String(row.id),
  title: row.title,
  grade: row.grade,
  subject: row.subject,
  author: row.author,
  isbn: row.isbn,
  price: Number(row.price),
  publisherId: String(row.publisher_id),
  publisherName: row.publisher_name,
  description: row.description,
  coverImage: row.cover_image,
  createdAt: row.created_at,
});

const getAllBooks = async () => {
  const [rows] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
  return rows.map(mapBook);
};

const getBookById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
  return rows[0] ? mapBook(rows[0]) : null;
};

const createBook = async ({
  title,
  grade,
  subject,
  author,
  isbn,
  price,
  publisherId,
  publisherName,
  description,
  coverImage,
}) => {
  const [result] = await pool.query(
    `INSERT INTO books (
      title, grade, subject, author, isbn, price, publisher_id, publisher_name, description, cover_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      grade,
      subject,
      author,
      isbn,
      price,
      publisherId,
      publisherName,
      description || null,
      coverImage || null,
    ]
  );

  return getBookById(result.insertId);
};

const updateBook = async (id, payload) => {
  const fields = [];
  const values = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (!fields.length) return getBookById(id);

  values.push(id);
  await pool.query(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`, values);
  return getBookById(id);
};

const deleteBook = async (id) => {
  await pool.query('DELETE FROM books WHERE id = ?', [id]);
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

