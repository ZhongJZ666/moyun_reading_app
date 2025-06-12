const db = require('../config/db.config');

class Circle {
  // 创建圈子（由导师创建）
  static async create({ name, description, mentor_id }) {
    const [result] = await db.execute(
      `INSERT INTO circles (name, description, mentor_id) 
       VALUES (?, ?, ?)`,
      [name, description, mentor_id]
    );
    return result.insertId;
  }

  // 通过导师ID查找圈子
  static async findByMentor(mentorId) {
    const [rows] = await db.execute(
      `SELECT * FROM circles WHERE mentor_id = ?`,
      [mentorId]
    );
    return rows[0];
  }

  // 添加成员到圈子
  static async addMember(circleId, userId) {
    await db.execute(
      `INSERT INTO circle_members (circle_id, user_id) 
       VALUES (?, ?)`,
      [circleId, userId]
    );
  }

  // 获取圈子所有成员
  static async getMembers(circleId) {
    const [rows] = await db.execute(
      `SELECT u.id, u.username, u.email 
       FROM circle_members cm 
       JOIN users u ON cm.user_id = u.id 
       WHERE cm.circle_id = ?`,
      [circleId]
    );
    return rows;
  }

  // 删除圈子
  static async delete(circleId) {
    await db.execute('DELETE FROM circles WHERE id = ?', [circleId]);
  }

  // 查询所有圈子
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM circles');
    return rows;
  }

  // 查询用户加入的所有圈子
  static async findByUser(userId) {
    const [rows] = await db.execute(
      `SELECT c.* FROM circles c
       JOIN circle_members cm ON c.id = cm.circle_id
       WHERE cm.user_id = ?`,
      [userId]
    );
    return rows;
  }
}

module.exports = Circle;