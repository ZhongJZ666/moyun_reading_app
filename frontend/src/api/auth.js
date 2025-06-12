import request from '@/utils/request'
import { getAuthHeader, clearAuthData, setAuthData } from './utils';

class AuthAPI {
  // 用户注册
  static async register(userData) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: userData
    })
  }

  // 用户登录
  static async login(username, password) {
    try {
      const response = await request({
        url: '/auth/login',
        method: 'post',
        data: { username, password }
      })
      
      if (response.token) {
        setAuthData(response.token)
        // 解析并返回用户信息
        const user = this._getUserFromToken(response.token)
        if (!user) {
          throw new Error('无效的token')
        }
        return user
      }
      throw new Error('登录失败：未获取到token')
    } catch (error) {
      clearAuthData()
      throw error
    }
  }

  // 用户登出
  static async logout() {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await request({
          url: '/auth/logout',
          method: 'post',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    } finally {
      clearAuthData()
    }
  }

  // 获取当前用户信息
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未登录')
      }
      return await request({
        url: '/users/me',
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData()
      }
      throw error
    }
  }

  // 更新用户信息
  static async updateProfile(data) {
    return request({
      url: '/users/me',
      method: 'put',
      data
    })
  }

  // 获取导师的学生列表
  static async getStudents() {
    return request({
      url: '/users/students',
      method: 'get'
    })
  }

  // 获取所有用户（仅管理员）
  static async getAllUsers() {
    return request({
      url: '/users',
      method: 'get'
    })
  }

  // 删除用户（仅管理员）
  static async deleteUser(userId) {
    return request({
      url: `/users/${userId}`,
      method: 'delete'
    })
  }

  // 从JWT解析用户信息
  static _getUserFromToken(token) {
    try {
      const base64Payload = token.split('.')[1]
      const payload = JSON.parse(atob(base64Payload))
      return {
        id: payload.id,
        username: payload.username,
        role: payload.role
      }
    } catch (error) {
      console.error('解析token失败:', error)
      return null
    }
  }

  // 统一错误处理
  static _handleError(error) {
    if (error.response) {
      // 后端返回的业务错误
      return new Error(error.response.data.message || '请求失败');
    } else {
      // 网络或系统错误
      return new Error('网络连接异常，请稍后重试');
    }
  }
}

export default AuthAPI;