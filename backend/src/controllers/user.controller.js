const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const { logger } = require('../utils/logger');

// 获取用户资料
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    logger.error('获取用户资料错误:', error);
    res.status(500).json({ message: error.message });
  }
};

// 更新用户资料
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userService.updateUserProfile(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    logger.error('更新用户资料错误:', error);
    res.status(500).json({ message: error.message });
  }
};

// 获取导师的学生列表
const getStudents = async (req, res) => {
  try {
    const students = await userService.getStudentsByMentor(req.user.id);
    res.json(students);
  } catch (error) {
    logger.error('获取学生列表错误:', error);
    res.status(500).json({ message: error.message });
  }
};

// 获取所有用户（仅管理员）
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('获取用户列表错误:', error);
    res.status(500).json({ message: error.message });
  }
};

// 删除用户（仅管理员）
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: '用户删除成功' });
  } catch (error) {
    logger.error('删除用户错误:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStudents,
  getAllUsers,
  deleteUser
};