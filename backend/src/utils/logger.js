const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const chalk = require('chalk');

// 日志级别配置
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// 日志颜色映射
const LEVEL_COLORS = {
  [LOG_LEVELS.ERROR]: chalk.red.bold,
  [LOG_LEVELS.WARN]: chalk.yellow.bold,
  [LOG_LEVELS.INFO]: chalk.green.bold,
  [LOG_LEVELS.DEBUG]: chalk.blue.bold
};

class Logger {
  constructor(options = {}) {
    // 默认配置
    this.options = {
      logLevel: process.env.LOG_LEVEL || LOG_LEVELS.INFO,
      logToFile: process.env.LOG_TO_FILE === 'true',
      logDir: path.join(__dirname, '../../logs'),
      ...options
    };

    // 确保日志目录存在
    if (this.options.logToFile) {
      this._ensureLogDir();
    }
  }

  // 创建日志目录
  _ensureLogDir() {
    if (!fs.existsSync(this.options.logDir)) {
      fs.mkdirSync(this.options.logDir, { recursive: true });
    }
  }

  // 获取当前日志文件名
  _getLogFileName() {
    const date = format(new Date(), 'yyyy-MM-dd');
    return path.join(this.options.logDir, `app_${date}.log`);
  }

  // 格式化日志消息
  _formatMessage(level, message) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  }

  // 写入日志文件
  _writeToFile(level, message) {
    if (!this.options.logToFile) return;

    const logMessage = this._formatMessage(level, message);
    fs.appendFile(this._getLogFileName(), logMessage, (err) => {
      if (err) console.error('写入日志文件失败:', err);
    });
  }

  // 控制台输出
  _consoleLog(level, message) {
    if (LOG_LEVELS[level.toUpperCase()] > LOG_LEVELS[this.options.logLevel.toUpperCase()]) return;

    const color = LEVEL_COLORS[level] || chalk.white;
    console.log(color(this._formatMessage(level, message).trim()));
  }

  // 通用日志方法
  _log(level, message) {
    this._consoleLog(level, message);
    this._writeToFile(level, message);
  }

  // 各级别日志方法
  error(message) {
    this._log(LOG_LEVELS.ERROR, message);
  }

  warn(message) {
    this._log(LOG_LEVELS.WARN, message);
  }

  info(message) {
    this._log(LOG_LEVELS.INFO, message);
  }

  debug(message) {
    this._log(LOG_LEVELS.DEBUG, message);
  }

  // Express请求日志中间件
  requestLogger() {
    return (req, res, next) => {
      const startTime = Date.now();
      const { method, originalUrl, ip } = req;

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { statusCode } = res;
        const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`;

        if (statusCode >= 500) {
          this.error(logMessage);
        } else if (statusCode >= 400) {
          this.warn(logMessage);
        } else {
          this.info(logMessage);
        }
      });

      next();
    };
  }
}

// 创建默认logger实例
const logger = new Logger();

module.exports = {
  logger,
  LOG_LEVELS,
  Logger // 可选导出类用于自定义实例
};