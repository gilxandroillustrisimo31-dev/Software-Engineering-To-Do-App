const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../controllers/authController');

// All task routes require authentication
router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);
router.patch('/:id/toggle', verifyToken, taskController.toggleTaskStatus);

module.exports = router;
