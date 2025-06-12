const express = require('express');
const CommentController = require('../controllers/comment.controller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

const router = express.Router();

// 添加评论（需登录）
router.post('/:postId', 
  auth(),
  [
    check('content').notEmpty().isLength({ max: 500 })
  ],
  CommentController.addComment
);

// 获取帖子的评论（公开）
router.get('/:postId', CommentController.getCommentsByPost);

module.exports = router;