const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.service');
require('dotenv').config();

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      // 获取token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '认证令牌格式错误' });
      }

      // 验证token
      const decoded = await AuthService.verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: '无效的认证令牌' });
      }

      // 将用户信息添加到请求对象
      req.user = decoded;

      // 检查角色权限
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: '权限不足' });
      }

      next();
    } catch (error) {
      console.error('认证错误:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '认证令牌已过期' });
      }
      return res.status(401).json({ message: '认证失败' });
    }
  };
};

module.exports = auth;