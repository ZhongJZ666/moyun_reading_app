const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: process.env.DB_PORT ||  3306,
  user: 'root',
  password: '123456',
  database: 'moyun_reading',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;