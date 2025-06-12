const express = require('express');
const BookController = require('../controllers/book.controller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('只允许上传jpg、jpeg或png格式的图片！'), false);
    }
    cb(null, true);
  }
});

// 获取所有书籍（公开）
router.get('/', BookController.getAllBooks);

// 获取书籍详情（公开）
router.get('/:id', BookController.getBookById);

// --- 需认证的路由 ---
// 上传书籍封面
router.post('/upload-cover', 
  auth(['mentor', 'admin']),
  upload.single('cover'),
  BookController.uploadCover
);

// 推荐新书（仅导师和管理员）
router.post('/', 
  auth(['mentor', 'admin']),
  [
    check('title').notEmpty(),
    check('author').notEmpty(),
    check('description').optional(),
    check('cover_url').optional()
  ],
  BookController.createBook
);

// 删除书籍（仅管理员）
router.delete('/:id', auth(['admin']), BookController.deleteBook);

module.exports = router;