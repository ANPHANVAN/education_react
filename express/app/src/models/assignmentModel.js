const mongoose = require('mongoose');

const assignmentsSchema = new mongoose.Schema({
  assignment_name: { type: String,
    required: true },
  test_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Tests' },
  type: { type: String,
    required: true,
    enum: ['abcd', 'truefalse', 'short'] },
  video_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos' },
  class_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes' }
});

module.exports = mongoose.model('Assignments', assignmentsSchema);

