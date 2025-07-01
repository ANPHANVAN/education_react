const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['abcd', 'truefalse', 'value'] },
  part: { type: String, required: true },
  number: { type: String, required: true },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    // A, B, C, D for abcd type
    // true, false for truefalse type
    // value for value type
    required: true,
  },
  score: { type: Number, required: true },
});

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url_file: { type: String, required: true },
    answers: { type: [answersSchema], required: true },
    grade: { type: Number, required: true },
    test_time: {
      type: Number, // in minutes
      required: true,
    },
    subject: {
      type: String,
      required: true,
      default: 'Toán',
      enum: ['Toán', 'Vật Lý', 'Hóa học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh'],
    },
    teacher_owner_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    number_sentence: { type: Number },
    description: { type: String },
    class: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Classes' },
    see_answer: { type: Boolean, default: false },
    sum_score: {
      type: Number,
    },
  },
  { timestamps: true }
);
testSchema.index({ teacher_owner_id: 1, class: 1 });

module.exports = mongoose.model('Tests', testSchema);
