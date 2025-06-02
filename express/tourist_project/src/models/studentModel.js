const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, 
        required: true },
    student_user_id: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Classes', 
        required: true },
    registration_number: { type: String, 
        required: true },
})

module.exports = mongoose.model('Students', studentSchema);