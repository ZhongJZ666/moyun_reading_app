const Message = require('../models/message');
const { Op } = require('sequelize');
const User = require('../models/user.model');

// 获取消息列表
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, size = 20, type } = req.query;
    const offset = (page - 1) * size;
    const userId = req.user.id;

    const where = {
      [Op.or]: [
        { receiverId: userId },
        { senderId: userId }
      ]
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    const { count, rows: messages } = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(size)
    });

    res.json({
      items: messages,
      total: count,
      hasMore: offset + messages.length < count
    });
  } catch (error) {
    console.error('获取消息列表失败:', error);
    res.status(500).json({ message: '获取消息列表失败' });
  }
};

// 获取与特定用户的聊天记录
exports.getChatMessages = async (req, res) => {
  try {
    const { page = 1, size = 20 } = req.query;
    const offset = (page - 1) * size;
    const userId = req.user.id;
    const targetId = parseInt(req.params.userId);

    const where = {
      [Op.or]: [
        { senderId: userId, receiverId: targetId },
        { senderId: targetId, receiverId: userId }
      ]
    };

    const { count, rows: messages } = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(size)
    });

    res.json({
      items: messages,
      total: count,
      hasMore: offset + messages.length < count
    });
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    res.status(500).json({ message: '获取聊天记录失败' });
  }
};

// 发送消息
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type = 'private' } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      type
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: require('../models/user'),
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: require('../models/user'),
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    // 这里可以添加 WebSocket 推送逻辑

    res.json(fullMessage);
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ message: '发送消息失败' });
  }
};

// 标记消息为已读
exports.markAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        receiverId: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: '消息不存在' });
    }

    await message.update({ read: true });
    res.json({ message: '标记已读成功' });
  } catch (error) {
    console.error('标记已读失败:', error);
    res.status(500).json({ message: '标记已读失败' });
  }
};

// 标记所有消息为已读
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Message.update(
      { read: true },
      {
        where: {
          receiverId: userId,
          read: false
        }
      }
    );

    res.json({ message: '全部标记已读成功' });
  } catch (error) {
    console.error('标记全部已读失败:', error);
    res.status(500).json({ message: '标记全部已读失败' });
  }
};

// 删除消息
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ message: '消息不存在' });
    }

    await message.destroy();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除消息失败:', error);
    res.status(500).json({ message: '删除消息失败' });
  }
};

// 清空所有消息
exports.clearAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    await Message.destroy({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });

    res.json({ message: '清空成功' });
  } catch (error) {
    console.error('清空消息失败:', error);
    res.status(500).json({ message: '清空消息失败' });
  }
}; 