const mongoose = require('mongoose')

const submissionsSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Users' },
  class_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes' },
  subject: { type: String,
    required: true },
  grade: { type: Number,
    required: true },
  score: { type: Number,
    required: true },
  time_begin: { type: Date,
    required: true },
  time_end: { type: Date,
    required: true },
  time_test: { type: Number, // in minutes
    required: true },
  test_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Tests',
    required: true },
  assignment_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignments',
    required: true }
},{timestamps: true})

module.exports = mongoose.model('Submissions', submissionsSchema)