const mongoose = require('mongoose')

const essaySubmitSchema = new mongoose.Schema({
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    essay_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Essay',
        required: true
    }, 
    grade: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    score:{ 
        type: Number,
    },
    url_file_submit :{
        type: String,
        required: true
    },
    comments: {
        type: String,
    }
},{timestamps: true})

module.exports = mongoose.model('EssaySubmits', essaySubmitSchema)