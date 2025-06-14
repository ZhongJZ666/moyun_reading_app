const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { logger } = require('./utils/logger');
const auth = require('./middlewares/auth');
const sequelizePromise = require('./config/database');
const net = require('net');

// 查找可用端口
const findAvailablePort = async (startPort) => {
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = require('net').createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};

const app = express();

// 安全响应头配置
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// 中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Content-Type-Options']
}));

// 添加静态文件服务
app.use('/uploads', express.static('uploads'));

// 路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const circleRoutes = require('./routes/circle.routes');
const bookRoutes = require('./routes/book.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notification.routes');
const mentorRoutes = require('./routes/mentor.routes');
const userBookRoutes = require('./routes/userBook.routes');
const todoRoutes = require('./routes/todo.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/user-books', userBookRoutes);
app.use('/api/todos', todoRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('未捕获的错误:', err);
  res.status(500).json({ message: '服务器内部错误' });
});

// 初始化应用
const initApp = async () => {
  try {
    // 等待数据库连接
    await sequelizePromise;
    
    // 查找可用端口
    const desiredPort = process.env.PORT || 3000;
    const port = await findAvailablePort(desiredPort);
    
    // 启动服务器
    app.listen(port, () => {
      logger.info(`服务器运行在端口 ${port}`);
      if (port !== desiredPort) {
        logger.warn(`注意：端口 ${desiredPort} 已被占用，已自动切换到端口 ${port}`);
      }
    });
  } catch (err) {
    logger.error('应用初始化失败:', err);
    process.exit(1);
  }
};

// 启动应用
initApp();

module.exports = app;