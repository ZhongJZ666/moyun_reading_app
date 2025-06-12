const bookService = require('../services/book.service');
const path = require('path');

class BookController {
  static async createBook(req, res) {
    try {
      const { title, author, description, cover_url, content } = req.body;
      
      // 处理封面图片URL
      let finalCoverUrl = cover_url;
      if (cover_url && !cover_url.startsWith('images/')) {
        finalCoverUrl = 'images/' + path.basename(cover_url);
      }

      const book = await bookService.create({
        title,
        author,
        description,
        content,
        cover_url: finalCoverUrl,
        recommender_id: req.user.id
      });
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllBooks(req, res) {
    try {
      const { search = '', page = 1, size = 12 } = req.query;
      const books = await bookService.findAll({
        search,
        page: parseInt(page, 10),
        size: parseInt(size, 10)
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBookById(req, res) {
    try {
      const book = await bookService.findById(req.params.id);
      if (!book) throw new Error('Book not found');
      res.json(book);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // 管理员专属接口
  static async deleteBook(req, res) {
    try {
      await bookService.delete(req.params.id);
      res.json({ message: 'Book deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 处理书籍封面上传
  static async uploadCover(req, res) {
    try {
      if (!req.file) {
        throw new Error('请选择要上传的图片');
      }
      // 只返回 images/文件名
      const coverUrl = 'images/' + req.file.filename;
      res.json({
        message: '封面上传成功',
        cover_url: coverUrl
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = BookController;