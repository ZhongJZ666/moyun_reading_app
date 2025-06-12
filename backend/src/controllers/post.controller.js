const PostService = require('../services/post.service');

class PostController {
  static async createPost(req, res) {
    try {
      const postId = await PostService.create({
        title: req.body.title,
        content: req.body.content,
        author_id: req.user.id,
        book_id: req.body.book_id
      });
      res.status(201).json({ id: postId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPostsByCircle(req, res) {
    try {
      const posts = await PostService.findByCircle(req.params.circleId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPostsByBook(req, res) {
    try {
      const posts = await PostService.findByBook(req.params.bookId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const post = await PostService.findById(req.params.id);
      if (post.author_id !== req.user.id && req.user.role !== 'admin') {
        throw new Error('No permission to delete');
      }
      await PostService.delete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  }
}

module.exports = PostController;