const express = require('express');
const { addFeedback, listFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('school'), addFeedback);
router.get('/', authMiddleware, roleMiddleware('admin', 'school', 'publisher'), listFeedback);

module.exports = router;

