const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    type: { type: String,
        required: true,
        enum: ['abcd', 'truefalse', 'value'] },

    part: { type: String,
        required: true,
        enum: ['part_1', 'part_2', 'part_3'] },

    number: { type: String,
        required: true },
        
    answer: { type: mongoose.Schema.Types.Mixed,
      // A, B, C, D for abcd type
      // true, false for truefalse type
      // value for value type
        required: true },
})

const classSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Classes' }
},{ timestamps: true})

const testSchema = new mongoose.Schema({
  title: { type: String,
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
    default: 'math',
    enum: ['math', 'physics', 'chemistry', 'literature', 'history', 'geography', 'english'] },

    teacher_owner_id: { type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users' },

  number_sentence: { type: Number },

  description: { type: String },

  class: { type: [classSchema] },

  see_answer: { type: Boolean,
    default: false }

}, { timestamps: true });

module.exports = mongoose.model('Tests', testSchema);