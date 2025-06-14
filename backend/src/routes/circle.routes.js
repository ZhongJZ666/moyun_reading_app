const express = require('express');
const CircleController = require('../controllers/circle.controller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

const router = express.Router();

// 创建圈子（仅导师）
router.post('/', 
  auth(['mentor']),
  [
    check('name').notEmpty(),
    check('description').optional()
  ],
  CircleController.createCircle
);

// 获取我的圈子（成员或导师）
router.get('/my', auth(), CircleController.getMyCircles);

// 添加成员到圈子（仅导师）
router.post('/:circleId/members', 
  auth(['mentor']),
  [
    check('userId').isInt()
  ],
  CircleController.addMember
);

// 获取所有圈子
router.get('/', CircleController.getAllCircles);

// 当前用户加入圈子
router.post('/:circleId/join', auth(), CircleController.joinCircle);

module.exports = router;