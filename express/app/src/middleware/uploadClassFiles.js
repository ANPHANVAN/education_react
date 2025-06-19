// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let classId;
    if (req.params.class_id) {
      classId = req.params.class_id;
    } else if (req.params.classId) {
      classId = req.params.classId;
    } else if ( req.query['class-id'] ) {
      classId = req.query['class-id'];
    } else if ( req.query['class_id'] ) {
      classId = req.query['class_id'];
    } 
    const dest = `/app/src/uploads/class/${classId}`
    fs.mkdirSync(dest, { recursive: true }); // Tạo thư mục nếu chưa có
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

// Giới hạn loại file nếu muốn (ví dụ chỉ nhận PDF và DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf','.png', '.jpeg', '.jpg', '.docx', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("'Only .pdf','.png', '.jpeg', '.jpg', '.docx', '.xlsx', 'files are allowed'"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Giới hạn 20MB
});

module.exports = upload;
