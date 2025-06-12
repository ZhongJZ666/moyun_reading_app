FROM node:18-alpine
WORKDIR /app

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用（添加 --no-lint 参数）
RUN npm run build -- --no-lint

EXPOSE 8080

# 使用 serve 包来提供静态文件服务
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"] 