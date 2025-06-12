const CommentService = require('../services/comment.service');

class CommentController {
  static async addComment(req, res) {
    try {
      const commentId = await CommentService.create({
        content: req.body.content,
        author_id: req.user.id,
        post_id: req.params.postId
      });
      res.status(201).json({ id: commentId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getCommentsByPost(req, res) {
    try {
      const comments = await CommentService.findByPost(req.params.postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CommentController;