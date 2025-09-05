const express = require('express');
const router = express.Router();
const todoController = require('../controllers/taskService.js');
const authMiddleware = require('../middlewares/tokenValidator.js');

router.post('/', authMiddleware, todoController.createTask);
router.get('/', authMiddleware, todoController.getTasks);
router.put('/:id', authMiddleware, todoController.updateTask);
router.delete('/:id', authMiddleware, todoController.deleteTask);

module.exports = router;