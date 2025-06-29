// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = `/app/src/uploads/essay/student`;
    fs.mkdirSync(dest, { recursive: true }); // Tạo thư mục nếu chưa có
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Giới hạn loại file nếu muốn
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.png', '.jpeg', '.jpg', '.docx', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf,.png, .jpeg, .docx, .xlsx files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // Giới hạn 30MB
});

module.exports = upload;
