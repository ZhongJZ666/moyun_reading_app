const userBookService = require('../services/userBook.service');

class UserBookController {
  static async addBook(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.body;
      const record = await userBookService.addBook(userId, book_id);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getBooks(req, res) {
    try {
      const userId = req.user.id;
      const records = await userBookService.getBooks(userId);
      res.json(records);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async removeBook(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;
      await userBookService.removeBook(userId, book_id);
      res.json({ message: '已移除' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserBookController; 