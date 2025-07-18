const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Students', required: true },

    completed: { type: Boolean, default: false },

    video_requirement_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoRequirements',
      required: true,
    },

    completion_rate: {
      type: Number,
      default: 0, // Percentage of video watched
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
