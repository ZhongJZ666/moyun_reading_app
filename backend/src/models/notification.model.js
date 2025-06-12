const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '通知类型：system, comment, like, follow'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    target: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '通知目标，如帖子ID、评论ID等'
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '发送者ID，系统通知为null'
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '接收者ID'
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
    Notification.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver'
    });
  };

  return Notification;
}; 