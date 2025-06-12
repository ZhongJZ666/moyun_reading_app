const Post = require('../models/post.model');
const Circle = require('../models/circle.model');

class PostService {
  // 创建帖子
  static async create(postData) {
    // 验证圈子是否存在（如果指定了圈子）
    if (postData.circle_id) {
      const circle = await Circle.findByMentor(postData.circle_id);
      if (!circle) throw new Error('圈子不存在');
    }
    return await Post.create(postData);
  }

  // 获取帖子详情
  static async findById(postId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('帖子不存在');
    return post;
  }

  // 获取圈子内的帖子
  static async findByCircle(circleId) {
    return await Post.findByCircle(circleId);
  }

  // 获取与某本书相关的帖子
  static async findByBook(bookId) {
    return await Post.findByBook(bookId);
  }

  // 删除帖子
  static async delete(postId) {
    await Post.delete(postId);
  }
}

module.exports = PostService;