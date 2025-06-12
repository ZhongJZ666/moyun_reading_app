const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  let connection;
  try {
    // 创建不带数据库名的连接
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456'
    });

    // 读取 SQL 文件
    const sqlFile = await fs.readFile(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // 分割 SQL 语句
    const statements = sqlFile
      .split(';')
      .filter(statement => statement.trim())
      .map(statement => statement + ';');

    // 执行每个 SQL 语句
    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('数据库初始化成功！');
  } catch (error) {
    console.error('数据库初始化失败：', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initializeDatabase; 