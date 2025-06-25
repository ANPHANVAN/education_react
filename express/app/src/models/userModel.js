const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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
  },
  { timestamps: true }
);

UsersSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Users', UsersSchema);
