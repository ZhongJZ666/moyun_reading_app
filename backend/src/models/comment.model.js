const db = require('../config/db.config');

class Comment {
  // 添加评论
  static async create({ content, author_id, post_id }) {
    const [result] = await db.execute(
      `INSERT INTO comments (content, author_id, post_id) 
       VALUES (?, ?, ?)`,
      [content, author_id, post_id]
    );
    return result.insertId;
  }

  // 获取帖子的所有评论
  static async findByPost(postId) {
    const [rows] = await db.execute(
      `SELECT c.*, u.username as author_name 
       FROM comments c JOIN users u ON c.author_id = u.id 
       WHERE c.post_id = ? 
       ORDER BY c.created_at ASC`,
      [postId]
    );
    return rows;
  }

  // 删除评论
  static async delete(id) {
    await db.execute('DELETE FROM comments WHERE id = ?', [id]);
  }
}

module.exports = Comment;