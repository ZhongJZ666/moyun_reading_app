const TodoModel = require('../models/todo.model');

class TodoController {
  static async updateTodoStatus(req, res) {
    try {
      const todoId = req.params.id;
      const { completed } = req.body;
      const Todo = await TodoModel;
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        return res.status(404).json({ message: '待办事项不存在' });
      }
      todo.completed = completed;
      await todo.save();
      res.json({ message: '更新成功', todo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = TodoController; 