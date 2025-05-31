# Sử dụng Node.js image chính thức
FROM node:20-slim

# Đặt thư mục làm việc
WORKDIR /tourist_project

# Cài curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy package.json và package-lock.json để cài dependencies
COPY package*.json ./

# Cài dependencies (bao gồm devDependencies vì cần nodemon)
RUN npm ci

# Mở cổng 3000 (Express)
EXPOSE 3000

# Chạy nodemon
CMD ["npm", "start"]