const { DataTypes } = require('sequelize');
const sequelizePromise = require('../config/database');
const bcrypt = require('bcryptjs');

let User;

const initUserModel = async () => {
  const sequelize = await sequelizePromise;
  
  User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'mentor', 'student'),
      defaultValue: 'student'
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // 实例方法
  User.prototype.validatePassword = async function(password) {
    try {
      console.log('验证密码:', {
        inputPassword: password,
        storedHash: this.password
      });
      const result = await bcrypt.compare(password, this.password);
      console.log('密码验证结果:', result);
      return result;
    } catch (error) {
      console.error('密码验证错误:', error);
      return false;
    }
  };

  // 静态方法
  User.findByUsername = async function(username) {
    return this.findOne({ where: { username } });
  };

  User.findById = async function(id) {
    return this.findByPk(id);
  };

  User.getStudentsByMentor = async function(mentorId) {
    return this.findAll({
      where: { mentor_id: mentorId },
      attributes: ['id', 'username', 'email']
    });
  };

  User.getAllUsers = async function() {
    return this.findAll({
      attributes: ['id', 'username', 'email', 'role', 'mentor_id']
    });
  };

  return User;
};

// 初始化模型
const UserModel = initUserModel();

module.exports = UserModel;