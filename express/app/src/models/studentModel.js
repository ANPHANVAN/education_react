const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  student_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes', required: true },
  registration_number: {
    type: Number,
    required: true,
    unique: true,
    default: () => Math.floor(Math.random() * 1000000),
  },
  test: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Submissions',
    default: [],
  },
  video: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'VideoProgress',
    default: [],
  },
  essay: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EssaySubmits',
    default: [],
  },
});

module.exports = mongoose.model('Students', studentSchema);
