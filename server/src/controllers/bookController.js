const { getAllBooks, createBook, getBookById, updateBook, deleteBook } = require('../services/bookService');
const { uploadImage } = require('../services/cloudinaryService');

const listBooks = async (req, res, next) => {
  try {
    const books = await getAllBooks();
    res.json({ data: books });
  } catch (error) {
    next(error);
  }
};

const fetchBook = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ data: book });
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    const { title, grade, subject, author, isbn, price, description } = req.body;

    if (!title || !grade || !subject || !author || !isbn || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    let coverImage;
    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer);
      coverImage = uploaded.secure_url;
    }

    const book = await createBook({
      title,
      grade,
      subject,
      author,
      isbn,
      price: parsedPrice,
      description,
      coverImage,
      publisherId: req.user.id,
      publisherName: req.user.email,
    });

    res.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
};

const ensureCanModify = (book, user) => {
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'admin' && String(book.publisherId) !== String(user.id)) {
    const error = new Error('You are not allowed to modify this book');
    error.statusCode = 403;
    throw error;
  }
};

const editBook = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);
    ensureCanModify(book, req.user);

    const updates = { ...req.body };
    if (updates.price !== undefined) {
      const parsedPrice = Number(updates.price);
      if (Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
      }
      updates.price = parsedPrice;
    }

    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer);
      updates.coverImage = uploaded.secure_url;
    }

    const updatedBook = await updateBook(req.params.id, updates);
    res.json({ data: updatedBook });
  } catch (error) {
    next(error);
  }
};

const removeBook = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);
    ensureCanModify(book, req.user);
    await deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listBooks,
  fetchBook,
  addBook,
  editBook,
  removeBook,
};

