const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url_file: {
      type: String,
      required: true,
    },
    file_origin_name: {
      type: String,
      required: true,
    },
    teacher_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classes',
    },
  },
  { timestamps: true }
);
folderSchema.index({ teacher_owner_id: 1 });
folderSchema.index({ class_id: 1 });
module.exports = mongoose.model('Folders', folderSchema);
