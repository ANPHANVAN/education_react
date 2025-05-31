const mongoose = require('mongoose');

const classesSchema = new mongoose.Schema({
  grade: { type: Number, 
    required: true },
  class_name: { type: String, 
    required: true },
  number_student: { type: Number, 
    required: true,
    default: 0 },
  student_id: { type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Users' },
  teacher_id: { type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Users' },
  assignment_id: { type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Assignments' },
},{ timestamps: true });

module.exports = mongoose.model('Classes', classesSchema);