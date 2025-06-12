const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middlewares/auth');

// 获取通知列表
router.get('/', auth, notificationController.getNotifications);

// 获取未读通知数量
router.get('/unread/count', auth, notificationController.getUnreadCount);

// 标记通知为已读
router.put('/:notificationId/read', auth, notificationController.markAsRead);

// 标记所有通知为已读
router.put('/read-all', auth, notificationController.markAllAsRead);

// 删除通知
router.delete('/:notificationId', auth, notificationController.deleteNotification);

// 清空所有通知
router.delete('/', auth, notificationController.clearAll);

module.exports = router; 