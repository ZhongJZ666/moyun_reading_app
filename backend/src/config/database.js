const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const createDatabase = () => {
  return mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'admin',
    password: '123456'
  })
  .then(connection => {
    return connection.query('CREATE DATABASE IF NOT EXISTS moyun_reading CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
      .then(() => {
        console.log('数据库创建/验证成功');
        return connection.end();
      });
  })
  .catch(err => {
    console.error('创建数据库失败:', err);
    process.exit(1);
  });
};

// 创建数据库并初始化 Sequelize
const initDatabase = () => {
  return createDatabase()
    .then(() => {
      const sequelize = new Sequelize('moyun_reading', 'admin', '123456', {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        define: {
          underscored: true,  // 使用下划线命名
          timestamps: true,   // 启用时间戳
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci'
        },
        dialectOptions: {
          charset: 'utf8mb4',
          supportBigNumbers: true,
          bigNumberStrings: true,
          // 添加连接保活配置
          connectTimeout: 60000
        },
        pool: {
          max: 10,
          min: 0,
          acquire: 60000,
          idle: 30000,
          // 添加连接超时设置
          evict: 1000,
          // 添加连接保活
          handleDisconnects: true
        },
        retry: {
          max: 3, // 最大重试次数
          match: [
            /Deadlock/i,
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /TimeoutError/
          ]
        },
        logging: (msg) => {
          console.log('Sequelize:', msg);
          if (msg.includes('Error')) {
            console.error('SQL Error:', msg);
          }
        }
      });

      // 测试数据库连接
      return sequelize.authenticate()
        .then(() => {
          console.log('数据库连接成功！');
          // 测试数据库字符集
          return sequelize.query('SHOW VARIABLES LIKE "character_set_database"');
        })
        .then(([results]) => {
          console.log('数据库字符集:', results[0].Value);
          return sequelize.query('SHOW VARIABLES LIKE "collation_database"');
        })
        .then(([results]) => {
          console.log('数据库排序规则:', results[0].Value);
          return sequelize;
        })
        .catch(err => {
          console.error('数据库连接失败：', err);
          console.error('错误详情：', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            stack: err.stack
          });
          // 如果是连接错误，退出进程
          if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('数据库连接错误，请检查配置后重试');
            process.exit(1);
          }
          throw err;
        });
    });
};

// 添加全局错误处理
const sequelize = initDatabase();

sequelize.then(seq => {
  // 添加连接事件监听
  seq.afterConnect(() => {
    console.log('数据库连接已建立');
  });

  seq.afterDisconnect(() => {
    console.log('数据库连接已断开，尝试重新连接...');
    // 尝试重新连接
    seq.authenticate()
      .then(() => {
        console.log('数据库重新连接成功！');
      })
      .catch(err => {
        console.error('数据库重新连接失败：', err);
      });
  });
});

// 添加全局错误处理
process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('检测到数据库连接丢失，尝试重新连接...');
    sequelize.then(seq => {
      seq.authenticate()
        .then(() => {
          console.log('数据库重新连接成功！');
        })
        .catch(err => {
          console.error('数据库重新连接失败：', err);
        });
    });
  }
});

module.exports = sequelize; 