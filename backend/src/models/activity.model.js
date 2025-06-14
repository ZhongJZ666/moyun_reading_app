const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');

let Activity;

const initActivityModel = async () => {
  const sequelize = await sequelizePromise;
  Activity = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mentor_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: 'info' }
  }, {
    tableName: 'activities',
    timestamps: false
  });
  return Activity;
};

module.exports = initActivityModel(); 