const express = require('express');
const multer = require('multer');
const { listUsers, changeUserStatus, listPublishers, uploadProfileImage, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public endpoint for publishers (for landing page)
router.get('/publishers/public', listPublishers);

// Protected endpoint for publishers (for authenticated users)
router.get(
  '/publishers',
  authMiddleware,
  roleMiddleware('admin', 'school'),
  listPublishers
);

// Profile image upload (authenticated users)
router.post('/profile-image', authMiddleware, upload.single('profileImage'), uploadProfileImage);

// Change password (authenticated users)
router.post('/change-password', authMiddleware, changePassword);

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/', listUsers);
router.patch('/:id/status', changeUserStatus);

module.exports = router;

