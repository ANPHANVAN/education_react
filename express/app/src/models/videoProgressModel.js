const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const videoProgressSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users' },

  completed: { type: Boolean,
    default: false
   },

  completion_rate: { type: Number,
    default: 0 // Percentage of video watched
   }

},{timestamps: true});

module.exports = mongoose.model('VideoProgress', videoProgressSchema);