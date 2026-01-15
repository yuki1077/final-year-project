const express = require('express');
const { listOrders, createNewOrder, changeOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listOrders);
router.post('/', authMiddleware, roleMiddleware('school'), createNewOrder);
router.patch('/:id', authMiddleware, roleMiddleware('admin', 'publisher'), changeOrderStatus);

module.exports = router;

