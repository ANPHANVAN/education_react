const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
  type: { type: String },
  part: { type: String },
  number: { type: String, required: true },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    // A, B, C, D for abcd type
    // true, false for truefalse type
    // value for value type
    required: true,
  },
});

const submissionsSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes' },
  subject: { type: String, required: true },
  grade: { type: Number, required: true },
  score: { type: Number, required: true },
  time_begin: { type: Date, required: true },
  time_end: { type: Date, required: true },
  time_test: {
    type: Number, // in minutes
  },
  test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tests', required: true },
  student_answers: { type: [answersSchema], required: true },
});
submissionsSchema.index({ student_id: 1, class_id: 1, test_id: 1 });

module.exports = mongoose.model('Submissions', submissionsSchema);
