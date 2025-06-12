const UserModel = require('../models/user.model');

class UserService {
  constructor() {
    this.User = null;
    this.init();
  }

  async init() {
    this.User = await UserModel;
  }

  // 获取用户资料
  async getUserProfile(userId) {
    if (!this.User) {
      await this.init();
    }
    return this.User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'mentor_id', 'avatar']
    });
  }

  // 更新用户资料
  async updateUserProfile(userId, updateData) {
    if (!this.User) {
      await this.init();
    }
    const user = await this.User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user.update(updateData);
  }

  // 获取导师的学生列表
  async getStudentsByMentor(mentorId) {
    if (!this.User) {
      await this.init();
    }
    return this.User.findAll({
      where: { mentor_id: mentorId },
      attributes: ['id', 'username', 'email', 'avatar']
    });
  }

  // 获取所有用户（仅管理员）
  async getAllUsers() {
    if (!this.User) {
      await this.init();
    }
    return this.User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'mentor_id', 'avatar']
    });
  }

  // 删除用户（仅管理员）
  async deleteUser(userId) {
    try {
      const user = await this.User.findByPk(userId);
      if (!user) {
        throw new Error('用户不存在');
      }
      await user.destroy();
    } catch (error) {
      console.error('删除用户错误:', error);
      throw error;
    }
  }
}

module.exports = new UserService();