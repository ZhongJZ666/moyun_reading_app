const express = require('express');
const TodoController = require('../controllers/todo.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

// 更新待办事项状态
router.patch('/todos/:id', auth(['mentor']), TodoController.updateTodoStatus);

module.exports = router; 