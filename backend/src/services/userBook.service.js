const UserBookModel = require('../models/userBook.model');

class UserBookService {
  constructor() {
    this.UserBook = null;
    this.init();
  }

  async init() {
    this.UserBook = await UserBookModel;
  }

  async addBook(userId, bookId) {
    if (!this.UserBook) await this.init();
    return await this.UserBook.create({ user_id: userId, book_id: bookId });
  }

  async getBooks(userId) {
    if (!this.UserBook) await this.init();
    return await this.UserBook.findAll({ where: { user_id: userId } });
  }

  async removeBook(userId, bookId) {
    if (!this.UserBook) await this.init();
    return await this.UserBook.destroy({ where: { user_id: userId, book_id: bookId } });
  }
}

module.exports = new UserBookService(); 