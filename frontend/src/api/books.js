import axios from 'axios';
import { getAuthHeader } from './utils';

const API_URL = 'http://localhost:3000/api/books';

class BookAPI {
  // 获取所有书籍
  static async getAll(params = {}) {
    try {
      const response = await axios.get(API_URL, {
        params,
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取书籍详情
  static async getDetail(bookId) {
    try {
      const response = await axios.get(`${API_URL}/${bookId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 推荐新书（导师权限）
  static async recommendBook(bookData) {
    try {
      const response = await axios.post(API_URL, bookData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 错误处理
  static _handleError(error) {
    if (error.response) {
      // 服务器返回错误响应
      const message = error.response.data?.message || '服务器错误';
      throw new Error(message);
    } else if (error.request) {
      // 请求发送失败
      throw new Error('网络连接失败');
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误');
    }
  }
}

export default BookAPI;