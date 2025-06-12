import axios from 'axios';
import { getAuthHeader } from './utils';

const API_URL = process.env.VUE_APP_API_BASE_URL + '/comments';

class CommentAPI {
  // 添加评论
  static async add(postId, content) {
    try {
      const response = await axios.post(
        `${API_URL}/${postId}`,
        { content },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取帖子评论
  static async getByPost(postId) {
    try {
      const response = await axios.get(`${API_URL}/${postId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }
}

export default CommentAPI;