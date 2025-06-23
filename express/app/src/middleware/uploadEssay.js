// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = `/app/src/uploads/essay`
    fs.mkdirSync(dest, { recursive: true }); // Tạo thư mục nếu chưa có
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },


});

// Giới hạn loại file nếu muốn (ví dụ chỉ nhận PDF và DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Giới hạn 20MB
});

module.exports = upload;
