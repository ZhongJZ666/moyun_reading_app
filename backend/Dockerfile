FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install date-fns
RUN npm install express-validator
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"] 