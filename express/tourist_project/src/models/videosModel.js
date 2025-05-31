const mongoose = require('mongoose');

const videosSchema = new mongoose.Schema({
  video_name: { type: String, 
    required: true },
  description: { type: String},
  video_embed: { type: String, 
    required: true },
  title: { type: String, 
    required: true },
  duration: { type: Number, 
    default: 0 },
});

module.exports = mongoose.model('Videos', videosSchema);