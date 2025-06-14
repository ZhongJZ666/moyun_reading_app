const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');

let UserBook;

const initUserBookModel = async () => {
  const sequelize = await sequelizePromise;
  UserBook = sequelize.define('UserBook', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'user_books',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return UserBook;
};

const UserBookModel = initUserBookModel();

module.exports = UserBookModel; 