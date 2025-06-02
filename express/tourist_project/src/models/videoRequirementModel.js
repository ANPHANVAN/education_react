const mongoose = require('mongoose');

const videoRequirementSchema = new mongoose.Schema({
    video_id: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Videos', 
        required: true },
    video_requirement_name: { type: String, 
        required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes', 
        required: true },
    time_begin: { type: Date },
    time_end: { type: Date },
    note: { type: String },
    }, { timestamps: true });

module.exports = mongoose.model('VideoRequirements', videoRequirementSchema);