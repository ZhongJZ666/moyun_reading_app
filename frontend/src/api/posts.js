import { http } from './http'
import { getAuthHeader } from './utils';

class PostAPI {
  // 创建帖子
  static async create({ title, content, circleId, bookId }) {
    const response = await http.post(
      '/posts',
      { title, content, circle_id: circleId, book_id: bookId }
    );
    return response.data;
  }

  // 获取圈子帖子列表
  static async getByCircle(circleId) {
    const response = await http.get(`/posts/circle/${circleId}`);
    return response.data;
  }

  // 获取帖子详情
  static async getDetail(postId) {
    const response = await http.get(`/posts/${postId}`);
    return response.data;
  }

  // 获取某本书的相关帖子
  static async getByBook(bookId) {
    const response = await http.get(`/posts/book/${bookId}`);
    return response.data;
  }
}

export default PostAPI;