const express = require('express');
const { register, login, getCurrentUser, resetPassword, logout } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

const router = express.Router();

// 用户注册
router.post('/register', 
  [
    check('username').notEmpty().withMessage('用户名不能为空'),
    check('password').isLength({ min: 6 }).withMessage('密码至少6位'),
    check('email').isEmail().withMessage('邮箱格式不正确'),
    check('role').isIn(['student', 'mentor', 'admin']).withMessage('角色不合法')
  ],
  register
);

// 用户登录
router.post('/login', 
  [
    check('username').notEmpty(),
    check('password').notEmpty()
  ],
  login
);

// 重置密码
router.post('/reset-password',
  [
    check('username').notEmpty().withMessage('用户名不能为空'),
    check('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位')
  ],
  resetPassword
);

// 获取当前用户信息
router.get('/me', auth(), getCurrentUser);

// 用户登出
router.post('/logout', logout);

module.exports = router;