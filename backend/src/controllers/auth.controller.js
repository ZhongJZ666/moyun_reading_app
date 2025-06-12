const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');
const { logger } = require('../utils/logger');

// 用户注册
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('注册错误:', error);
    res.status(400).json({ message: error.message });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    logger.info('登录请求体:', req.body);
    logger.info('尝试登录用户:', username);

    const { user, token } = await authService.login(username, password);
    res.json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('登录错误:', error);
    res.status(401).json({ message: error.message });
  }
};

// 重置密码
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, newPassword } = req.body;
    await authService.resetPassword(username, newPassword);
    res.json({ message: '密码重置成功' });
  } catch (error) {
    logger.error('重置密码错误:', error);
    res.status(400).json({ message: error.message });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.verifyToken(req.headers.authorization?.split(' ')[1]);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    logger.error('获取当前用户信息错误:', error);
    res.status(401).json({ message: '未授权' });
  }
};

// 用户登出
const logout = async (req, res) => {
  res.status(200).json({ message: '登出成功' });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  resetPassword,
  logout,
};