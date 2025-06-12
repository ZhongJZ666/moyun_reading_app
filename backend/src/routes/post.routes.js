const express = require('express');
const PostController = require('../controllers/post.controller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

const router = express.Router();

// 创建帖子（需登录）
router.post('/', 
  auth(),
  [
    check('title').notEmpty(),
    check('content').notEmpty(),
    check('circle_id').optional().isInt(),
    check('book_id').optional().isInt()
  ],
  PostController.createPost
);

// 获取圈子内的帖子（需属于该圈子）
router.get('/circle/:circleId', auth(), PostController.getPostsByCircle);

// 获取某本书的所有读后感
router.get('/book/:bookId', PostController.getPostsByBook);

// 删除帖子（作者或管理员）
router.delete('/:id', auth(), PostController.deletePost);

module.exports = router;