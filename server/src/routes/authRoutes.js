const express = require('express');
const multer = require('multer');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', upload.single('verificationDocument'), register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;

