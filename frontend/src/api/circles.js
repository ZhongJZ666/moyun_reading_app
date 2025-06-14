import axios from 'axios';
import { getAuthHeader } from './utils';

const API_URL = '/api/circles';

class CircleAPI {
  // 创建圈子（导师权限）
  static async create(name, description) {
    try {
      const response = await axios.post(
        API_URL,
        { name, description },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取我的圈子
  static async getMyCircle() {
    try {
      const response = await axios.get(`${API_URL}/my`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 添加成员到圈子
  static async addMember(circleId, userId) {
    try {
      const response = await axios.post(
        `${API_URL}/${circleId}/members`,
        { userId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取所有圈子
  static async getAll() {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 当前用户加入圈子
  static async joinCircle(circleId) {
    try {
      const response = await axios.post(
        `/api/circles/${circleId}/join`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // 获取我加入的所有圈子
  static async getMyCircles() {
    try {
      const response = await axios.get(`${API_URL}/my`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  static _handleError(error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export default CircleAPI;