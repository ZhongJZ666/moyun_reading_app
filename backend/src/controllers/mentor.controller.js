const UserModel = require('../models/user.model');
const ActivityModel = require('../models/activity.model');
const TodoModel = require('../models/todo.model');

class MentorController {
  static async getDashboard(req, res) {
    try {
      // 获取当前导师id
      const mentorId = req.user.id;
      // 查询学生列表
      const User = await UserModel;
      const Activity = await ActivityModel;
      const Todo = await TodoModel;
      const students = await User.getStudentsByMentor(mentorId);
      const activities = await Activity.findAll({
        where: { mentor_id: mentorId },
        order: [['time', 'DESC']],
        limit: 10
      });
      const todos = await Todo.findAll({
        where: { mentor_id: mentorId },
        order: [['id', 'DESC']]
      });
      res.json({
        students,
        activities,
        todos
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = MentorController; 