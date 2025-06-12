const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

// 获取消息列表
router.get('/', auth, messageController.getMessages);

// 获取与特定用户的聊天记录
router.get('/:userId', auth, messageController.getChatMessages);

// 发送消息
router.post('/', auth, messageController.sendMessage);

// 标记消息为已读
router.put('/:messageId/read', auth, messageController.markAsRead);

// 标记所有消息为已读
router.put('/read-all', auth, messageController.markAllAsRead);

// 删除消息
router.delete('/:id', auth, messageController.deleteMessage);

// 清空所有消息
router.delete('/', auth, messageController.clearAllMessages);

module.exports = router; 