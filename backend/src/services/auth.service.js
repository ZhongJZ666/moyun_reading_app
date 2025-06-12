const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
require('dotenv').config();

class AuthService {
  constructor() {
    this.User = null;
    this.init();
  }

  async init() {
    this.User = await UserModel;
  }

  // 用户注册
  async register(userData) {
    if (!this.User) {
      await this.init();
    }
    try {
      // 验证学生必须指定导师
      if (userData.role === 'student' && !userData.mentor_id) {
        throw new Error('学生必须关联导师');
      }

      // 验证用户名唯一性
      const existingUser = await this.User.findOne({ where: { username: userData.username } });
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 创建用户（密码加密由模型钩子处理）
      const user = await this.User.create(userData);
      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('用户名或邮箱已存在');
      }
      throw error;
    }
  }

  // 用户登录
  async login(username, password) {
    if (!this.User) {
      await this.init();
    }
    try {
      console.log('尝试登录用户:', username);
      
      const user = await this.User.findOne({ where: { username } });
      console.log('查询到的用户:', user ? '存在' : '不存在');
      
      if (!user) {
        throw new Error('用户不存在');
      }

      // 验证密码
      const isValid = await user.validatePassword(password);
      console.log('密码验证:', isValid ? '成功' : '失败');
      
      if (!isValid) {
        throw new Error('密码错误');
      }

      // 生成JWT令牌
      const token = this.generateToken(user);
      
      console.log('登录成功，生成token');
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  // 验证令牌
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (!this.User) {
        await this.init();
      }
      const user = await this.User.findByPk(decoded.id);
      if (!user) {
        throw new Error('用户不存在');
      }
      // 只返回必要字段，避免返回 Sequelize 实例
      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }

  // 重置密码
  async resetPassword(username, newPassword) {
    if (!this.User) {
      await this.init();
    }
    try {
      const user = await this.User.findOne({ where: { username } });
      if (!user) {
        throw new Error('用户不存在');
      }

      // 更新密码（密码加密由模型钩子处理）
      await user.update({ password: newPassword });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();