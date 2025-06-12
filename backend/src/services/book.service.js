const BookModel = require('../models/book.model');

class BookService {
  constructor() {
    this.Book = null;
    this.init();
  }

  async init() {
    this.Book = await BookModel;
  }

  // 创建书籍
  async create(bookData) {
    if (!this.Book) {
      await this.init();
    }
    return await this.Book.create(bookData);
  }

  // 获取所有书籍
  async findAll({ search = '', page = 1, size = 12 } = {}) {
    if (!this.Book) {
      await this.init();
    }
    const where = {};
    if (search) {
      const { Op } = require('sequelize');
      where.title = { [Op.like]: `%${search}%` };
    }
    const offset = (page - 1) * size;
    const { count, rows } = await this.Book.findAndCountAll({
      where,
      include: [{
        association: 'recommender',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['created_at', 'DESC']],
      limit: size,
      offset
    });
    return {
      items: rows,
      total: count,
      page,
      size
    };
  }

  // 获取书籍详情
  async findById(bookId) {
    if (!this.Book) {
      await this.init();
    }
    const book = await this.Book.findByPk(bookId, {
      include: [{
        association: 'recommender',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    if (!book) throw new Error('书籍不存在');
    return book;
  }

  // 获取推荐人发布的书籍
  async findByRecommender(recommenderId) {
    if (!this.Book) {
      await this.init();
    }
    return await this.Book.findAll({
      where: { recommender_id: recommenderId },
      include: [{
        association: 'recommender',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['created_at', 'DESC']]
    });
  }

  // 删除书籍（管理员用）
  async delete(bookId) {
    if (!this.Book) {
      await this.init();
    }
    const book = await this.Book.findByPk(bookId);
    if (!book) throw new Error('书籍不存在');
    await book.destroy();
  }
}

module.exports = new BookService();