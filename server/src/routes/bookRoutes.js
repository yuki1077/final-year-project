const express = require('express');
const multer = require('multer');
const { listBooks, fetchBook, addBook, editBook, removeBook } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes - accessible without authentication
router.get('/', listBooks);
router.get('/:id', fetchBook);
router.post('/', authMiddleware, roleMiddleware('publisher', 'admin'), upload.single('cover'), addBook);
router.put('/:id', authMiddleware, roleMiddleware('publisher', 'admin'), upload.single('cover'), editBook);
router.delete('/:id', authMiddleware, roleMiddleware('publisher', 'admin'), removeBook);

module.exports = router;

