const mongoose = require('mongoose');

const videoRequirementSchema = new mongoose.Schema(
  {
    class: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes',
      },
    ],
    video_requirement_name: { type: String, required: true },
    video_embed: { type: String, required: true },
    teacher_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    video_duration: { type: String },
    grade: { type: Number },
    time_begin: { type: Date },
    time_end: { type: Date },
    note: { type: String },
    subject: {
      type: String,
      enum: ['Toán', 'Vật Lý', 'Hóa học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VideoRequirements', videoRequirementSchema);
