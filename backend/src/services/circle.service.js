const Circle = require('../models/circle.model');
const UserModel = require('../models/user.model');

class CircleService {
  // 创建圈子
  static async create(circleData) {
    // 验证导师是否存在
    const User = await UserModel;
    const mentor = await User.findByPk(circleData.mentor_id);
    if (!mentor || mentor.role !== 'mentor') {
      throw new Error('指定的导师不存在');
    }
    return await Circle.create(circleData);
  }

  // 获取导师的圈子
  static async findByMentor(mentorId) {
    const circle = await Circle.findByMentor(mentorId);
    if (!circle) throw new Error('该导师尚未创建圈子');
    return circle;
  }

  // 添加成员到圈子
  static async addMember(circleId, userId) {
    // 获取 User Model
    const User = await UserModel;
    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    await Circle.addMember(circleId, userId);
  }

  // 获取圈子成员
  static async getMembers(circleId) {
    return await Circle.getMembers(circleId);
  }

  // 获取所有圈子
  static async findAll() {
    return await Circle.findAll();
  }

  // 获取用户加入的所有圈子
  static async findByUser(userId) {
    return await Circle.findByUser(userId);
  }
}

module.exports = CircleService;