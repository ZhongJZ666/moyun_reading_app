-- 创建数据库
CREATE DATABASE IF NOT EXISTS `moyun_reading` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `moyun_reading`;

-- 设置连接字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 用户表
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '加密后的密码',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) COMMENT '头像URL',
  `role` ENUM('student', 'mentor', 'admin') NOT NULL DEFAULT 'student' COMMENT '角色',
  `mentor_id` INT COMMENT '导师ID（仅学生有）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`),
  FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 书籍表
CREATE TABLE `books` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL COMMENT '书名',
  `author` VARCHAR(50) NOT NULL COMMENT '作者',
  `description` TEXT COMMENT '内容简介',
  `cover_url` VARCHAR(255) COMMENT '封面URL',
  `recommender_id` INT NOT NULL COMMENT '推荐人ID',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved' COMMENT '审核状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` LONGTEXT COMMENT '书籍全部内容',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `ft_title_author` (`title`, `author`) COMMENT '全文搜索索引',
  FOREIGN KEY (`recommender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='书籍表';

-- 圈子表
CREATE TABLE `circles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '圈子名称',
  `description` VARCHAR(255) COMMENT '圈子描述',
  `mentor_id` INT NOT NULL COMMENT '导师ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='导师圈子表';

-- 圈子成员表
CREATE TABLE `circle_members` (
  `circle_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`circle_id`, `user_id`),
  FOREIGN KEY (`circle_id`) REFERENCES `circles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='圈子成员表';

-- 读后感（posts）表
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT '标题',
  content TEXT NOT NULL COMMENT '内容',
  author_id INT NOT NULL COMMENT '作者ID',
  book_id INT NOT NULL COMMENT '关联书籍ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='读后感表';

-- 评论表
CREATE TABLE `comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL COMMENT '评论内容',
  `author_id` INT NOT NULL COMMENT '评论人ID',
  `post_id` INT NOT NULL COMMENT '所属帖子ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_post` (`post_id`),
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 举报记录表
CREATE TABLE `reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL COMMENT '举报内容',
  `reporter_id` INT NOT NULL COMMENT '举报人ID',
  `target_type` ENUM('post', 'comment', 'book') NOT NULL COMMENT '举报类型',
  `target_id` INT NOT NULL COMMENT '举报目标ID',
  `status` ENUM('pending', 'processed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='举报记录表';

-- 初始化管理员账号
INSERT INTO `users` (`username`, `password`, `email`, `role`) 
VALUES (
  'admin', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqUV3J3rG6ZMjZ9/3x3FQ7zJQlFyO', -- 密码: admin123
  'admin@moyun.com', 
  'admin'
);

-- 初始化导师账号
INSERT INTO `users` (`username`, `password`, `email`, `role`) 
VALUES 
  ('mentor1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor1@moyun.com', 'mentor'),
  ('mentor2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor2@moyun.com', 'mentor');

-- 初始化学生账号
INSERT INTO `users` (`username`, `password`, `email`, `role`, `mentor_id`) 
VALUES 
  ('student1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student1@moyun.com', 'student', 2),
  ('student2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student2@moyun.com', 'student', 2);

-- 初始化书籍数据
INSERT INTO `books` (`title`, `author`, `description`, `cover_url`, `recommender_id`) 
VALUES 
  ('JavaScript高级程序设计', 'Nicholas C.Zakas', '前端开发者必读经典', 'images/js.jpg', 2),
  ('深入理解计算机系统', 'Randal E.Bryant', '计算机科学经典教材', 'images/com.jpg', 3);

-- 初始化圈子
INSERT INTO `circles` (`name`, `description`, `mentor_id`) 
VALUES 
  ('Web前端开发组', '前端技术交流圈子', 2),
  ('系统架构研究组', '后端与系统设计讨论', 3);

-- 初始化圈子成员
INSERT INTO `circle_members` (`circle_id`, `user_id`) 
VALUES 
  (1, 4), (1, 5),  -- 导师2的学生加入圈子1
  (2, 4);          -- 学生1同时加入圈子2

CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL COMMENT '通知类型：system, comment, like, follow',
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  target JSON COMMENT '通知目标，如帖子ID、评论ID等',
  sender_id INT COMMENT '发送者ID，系统通知为null',
  receiver_id INT NOT NULL COMMENT '接收者ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';


-- 初始化通知测试数据
INSERT INTO notifications (type, content, is_read, target, sender_id, receiver_id)
VALUES
  ('system', '欢迎加入墨韵读书会！', FALSE, NULL, NULL, 2), -- mentor1收到系统通知
  ('comment', '有人评论了你的帖子', FALSE, '{"postId": 1}', 4, 2), -- student1评论mentor1的帖子
  ('like', '有人点赞了你的评论', FALSE, '{"commentId": 1}', 5, 4), -- student2点赞student1的评论
  ('follow', '有人关注了你', FALSE, '{"followerId": 5}', 5, 2), -- student2关注mentor1
  ('system', '系统维护通知：今晚0点服务器升级', TRUE, NULL, NULL, 3), -- mentor2收到已读系统通知
  ('comment', '你的评论被回复了', FALSE, '{"commentId": 2}', 2, 5); -- mentor1回复student2的评论

-- 示例数据
INSERT INTO posts (title, content, author_id, book_id)
VALUES
  ('很棒的书', '这本《JavaScript高级程序设计》讲解很细致，适合前端开发者。', 2, 1),
  ('收获很多', '内容系统全面，推荐给所有同学！', 4, 1),
  ('经典教材', '《深入理解计算机系统》是计算机基础必读书。', 3, 2);

-- 补充测试数据
UPDATE books SET content = '这是《JavaScript高级程序设计》的全部内容示例，适合前端开发者深入学习。' WHERE id = 1;
UPDATE books SET content = '这是《深入理解计算机系统》的全部内容示例，适合计算机基础学习。' WHERE id = 2;