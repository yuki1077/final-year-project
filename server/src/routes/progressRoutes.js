const express = require('express');
const { listEntries, listEntriesByPublisher, addEntry, editEntry, removeEntry } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Publisher route (must come before school routes)
router.get('/publisher', authMiddleware, roleMiddleware('publisher'), listEntriesByPublisher);

// School routes
router.use(authMiddleware, roleMiddleware('school'));
router.get('/', listEntries);
router.post('/', addEntry);
router.put('/:id', editEntry);
router.delete('/:id', removeEntry);

module.exports = router;

