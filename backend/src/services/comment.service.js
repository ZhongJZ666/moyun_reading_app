const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

class CommentService {
  // 添加评论
  static async create(commentData) {
    // 验证帖子是否存在
    const post = await Post.findById(commentData.post_id);
    if (!post) throw new Error('帖子不存在');
    
    return await Comment.create(commentData);
  }

  // 获取帖子的评论
  static async findByPost(postId) {
    return await Comment.findByPost(postId);
  }

  // 删除评论
  static async delete(commentId) {
    await Comment.delete(commentId);
  }
}

module.exports = CommentService;