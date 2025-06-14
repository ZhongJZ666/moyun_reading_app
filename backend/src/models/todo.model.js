const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');

let Todo;

const initTodoModel = async () => {
  const sequelize = await sequelizePromise;
  Todo = sequelize.define('Todo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mentor_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'todos',
    timestamps: false
  });
  return Todo;
};

module.exports = initTodoModel(); 