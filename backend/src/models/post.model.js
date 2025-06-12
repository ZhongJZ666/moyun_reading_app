const db = require('../config/db.config');

class Post {
  // 创建帖子
  static async create({ title, content, author_id, book_id }) {
    const [result] = await db.execute(
      `INSERT INTO posts (title, content, author_id, book_id) 
       VALUES (?, ?, ?, ?)`,
      [title, content, author_id, book_id]
    );
    return result.insertId;
  }

  // 通过ID查找帖子
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT p.*, u.username as author_name 
       FROM posts p JOIN users u ON p.author_id = u.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  // 获取圈子内的所有帖子
  static async findByCircle(circleId) {
    const [rows] = await db.execute(
      `SELECT p.*, u.username as author_name 
       FROM posts p JOIN users u ON p.author_id = u.id 
       WHERE p.circle_id = ? 
       ORDER BY p.created_at DESC`,
      [circleId]
    );
    return rows;
  }

  // 获取与某本书相关的帖子
  static async findByBook(bookId) {
    const [rows] = await db.execute(
      `SELECT p.*, u.username as author_name 
       FROM posts p JOIN users u ON p.author_id = u.id 
       WHERE p.book_id = ?`,
      [bookId]
    );
    return rows;
  }

  // 删除帖子
  static async delete(id) {
    await db.execute('DELETE FROM posts WHERE id = ?', [id]);
  }
}

module.exports = Post;