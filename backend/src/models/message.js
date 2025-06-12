const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');
const UserModel = require('./user.model');

let Message;

const initMessageModel = async () => {
  const sequelize = await sequelizePromise;
  const User = await UserModel;
  
  Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('private', 'group', 'system'),
      defaultValue: 'private'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'messages',
    indexes: [
      {
        fields: ['sender_id', 'receiver_id']
      },
      {
        fields: ['receiver_id', 'read']
      }
    ]
  });

  // 建立关联关系
  Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
  Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

  return Message;
};

// 初始化模型
const MessageModel = initMessageModel();

module.exports = MessageModel; 