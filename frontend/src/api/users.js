import axios from 'axios';
import { getAuthHeader } from './utils';

const API_URL = process.env.VUE_APP_API_BASE_URL + '/users';

class UserAPI {
  // 获取用户资料
  static async getProfile(userId) {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 更新资料
  static async updateProfile(updates) {
    try {
      const response = await axios.put(`${API_URL}/me`, updates, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取导师的学生列表
  static async getStudents(mentorId) {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        params: { mentor_id: mentorId },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 管理员：获取所有用户
  static async getAllUsers() {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }
}

export default UserAPI;