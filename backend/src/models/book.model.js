const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');

let Book;

const initBookModel = async () => {
  const sequelize = await sequelizePromise;
  
  Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '书名'
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '作者'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '内容简介'
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: '书籍全部内容'
    },
    cover_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '封面URL'
    },
    recommender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '推荐人ID'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'approved',
      comment: '审核状态'
    }
  }, {
    tableName: 'books',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // 建立关联关系
  Book.belongsTo(sequelize.models.User, {
    foreignKey: 'recommender_id',
    as: 'recommender'
  });

  return Book;
};

// 初始化模型
const BookModel = initBookModel();

module.exports = BookModel;