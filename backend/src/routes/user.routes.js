const express = require('express');
const UserController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

const router = express.Router();

// 获取当前用户资料（需登录）
router.get('/me', auth(), UserController.getProfile);

// 更新用户资料（需登录）
router.put('/me', auth(), UserController.updateProfile);

// 获取导师的学生列表（仅导师可访问）
router.get('/students', auth(['mentor']), UserController.getStudents);

// --- 管理员专属路由 ---
router.get('/', auth(['admin']), UserController.getAllUsers);
router.delete('/:id', auth(['admin']), UserController.deleteUser);

module.exports = router;