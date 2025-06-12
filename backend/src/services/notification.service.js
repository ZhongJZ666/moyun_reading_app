const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

class NotificationService {
  static async findByUser(userId, { page, size, type }) {
    const where = { receiver_id: userId };
    if (type && type !== 'all') {
      where.type = type;
    }

    const { count, rows } = await sequelize.models.Notification.findAndCountAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: size,
      offset: (page - 1) * size
    });

    return {
      items: rows,
      total: count,
      page,
      size,
      hasMore: count > page * size
    };
  }

  static async getUnreadCount(userId) {
    return await sequelize.models.Notification.count({
      where: {
        receiver_id: userId,
        is_read: false
      }
    });
  }

  static async markAsRead(notificationId, userId) {
    const notification = await sequelize.models.Notification.findOne({
      where: {
        id: notificationId,
        receiver_id: userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.is_read = true;
    await notification.save();
  }

  static async markAllAsRead(userId) {
    await sequelize.models.Notification.update(
      { is_read: true },
      {
        where: {
          receiver_id: userId,
          is_read: false
        }
      }
    );
  }

  static async delete(notificationId, userId) {
    const notification = await sequelize.models.Notification.findOne({
      where: {
        id: notificationId,
        receiver_id: userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.destroy();
  }

  static async clearAll(userId) {
    await sequelize.models.Notification.destroy({
      where: { receiver_id: userId }
    });
  }

  static async create(data) {
    return await sequelize.models.Notification.create(data);
  }
}

module.exports = NotificationService; 