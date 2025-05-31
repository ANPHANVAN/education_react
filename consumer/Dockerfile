# Sử dụng image Node.js chính thức
FROM node:20-slim

# Thiết lập thư mục làm việc
WORKDIR /tourist_project

# Copy package.json và cài đặt dependencies
COPY package.json .
RUN npm install

# Copy toàn bộ code của consumer
COPY . .

# Chạy consumer.js
CMD ["node", "consumer.js"]