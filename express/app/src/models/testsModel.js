const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    type: { type: String,
        required: true,
        enum: ['abcd', 'truefalse', 'short'] },
    number: { type: Number,
        required: true },
    answer: { type: mongoose.Schema.Types.Mixed,
        required: true },
})

const testsSchema = new mongoose.Schema({
  title: { type: String,
    required: true },
  description: { type: String,
    required: true },
  url_file: { type: String,
    required: true },
  answers: { type: [answersSchema],
    required: true }, 
  grade: { type: Number,
    required: true },
  test_time: { type: Number, // in minutes
    required: true },
  subject: { type: String,
    required: true,
    default: 'toán' },
  number_sentence: { type: Number,
    required: true },
  teacher_owner_id: { type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users' },
}, { timestamps: true });

module.exports = mongoose.model('Tests', testsSchema);