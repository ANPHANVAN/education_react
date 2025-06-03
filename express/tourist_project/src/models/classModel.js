const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Students' },
  student_user_id: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true },
})

announcementSchema = new mongoose.Schema({
  title: { type: String, 
    required: true },
  content: { type: String },
  date: { type: Date, 
    default: Date.now }
})

const classesSchema = new mongoose.Schema({
  grade: { type: Number, 
    required: true },
  class_name: { type: String, 
    required: true },
  number_student: { type: Number, 
    default: 0 },
  school_year: { type: String,
    required: true },
  students: [studentSchema],
  teacher_id: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' }],
  assignment_id: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignments' }],
  announcement: [announcementSchema],
},{ timestamps: true });

module.exports = mongoose.model('Classes', classesSchema);