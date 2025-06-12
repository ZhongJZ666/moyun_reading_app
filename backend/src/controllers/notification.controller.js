const { validationResult } = require('express-validator');
const NotificationService = require('../services/notification.service');

class NotificationController {
  // 获取通知列表
  static async getNotifications(req, res) {
    try {
      const { page = 1, size = 10, type } = req.query;
      const userId = req.user.id;

      const result = await NotificationService.findByUser(userId, {
        page: parseInt(page),
        size: parseInt(size),
        type
      });

      res.json(result);
    } catch (error) {
      console.error('获取通知列表失败:', error);
      res.status(500).json({ message: '获取通知列表失败' });
    }
  }

  // 获取未读通知数量
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      res.status(500).json({ message: '获取未读通知数量失败' });
    }
  }

  // 标记通知为已读
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      await NotificationService.markAsRead(notificationId, userId);
      res.json({ message: '标记已读成功' });
    } catch (error) {
      console.error('标记通知已读失败:', error);
      res.status(500).json({ message: '标记通知已读失败' });
    }
  }

  // 标记所有通知为已读
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.markAllAsRead(userId);
      res.json({ message: '标记所有通知已读成功' });
    } catch (error) {
      console.error('标记所有通知已读失败:', error);
      res.status(500).json({ message: '标记所有通知已读失败' });
    }
  }

  // 删除通知
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      await NotificationService.delete(notificationId, userId);
      res.json({ message: '删除通知成功' });
    } catch (error) {
      console.error('删除通知失败:', error);
      res.status(500).json({ message: '删除通知失败' });
    }
  }

  // 清空所有通知
  static async clearAll(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.clearAll(userId);
      res.json({ message: '清空所有通知成功' });
    } catch (error) {
      console.error('清空所有通知失败:', error);
      res.status(500).json({ message: '清空所有通知失败' });
    }
  }
}

module.exports = NotificationController; 