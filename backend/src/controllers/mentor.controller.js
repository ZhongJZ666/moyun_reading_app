class MentorController {
  static async getDashboard(req, res) {
    try {
      // 返回mock数据
      res.json({
        students: [],
        activities: [],
        todos: []
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = MentorController; 