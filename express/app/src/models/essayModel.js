const mongoose = require('mongoose')

const essaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url_file: {
        type: String,
        required: true
    },
    file_origin_name: {
        type: String,
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
    teacher_owner_id:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    class: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Classes',
    }
},{timestamps: true})

module.exports = mongoose.model('Essay', essaySchema)