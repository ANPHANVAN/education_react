const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ContentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    context: { type: String },
  },
  { _id: false }
);

// Schema cho mỗi part
const PartSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String },
    content: { type: [ContentSchema], default: [] },
  },
  { _id: false }
);

// Schema cho degree
const DegreeSchema = new mongoose.Schema(
  {
    _id: { type: String },
    context: { type: String },
  },
  { _id: false }
);

// Schema cho teacher_info
const TeacherInfoSchema = new mongoose.Schema(
  {
    titleFullname: { type: String },
    teacherSubject: { type: String },
    fullname: { type: String },
    teacherImageLink: { type: String },
    degree: { type: [DegreeSchema], default: [] },
    subject: { type: String },
    workPassion: { type: String },
    part: { type: [PartSchema], default: [] },
  },
  { _id: false }
);

const UsersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: Date },
    role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
    class_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes',
      },
    ],
    teacher_info: { type: Object, default: {} },
  },
  { timestamps: true }
);

UsersSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Users', UsersSchema);
