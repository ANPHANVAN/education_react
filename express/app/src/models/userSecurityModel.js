const mongoose = require('mongoose');

const UserSecuritySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hash_password: {
    type: String,
    required: true,
  },
});
UserSecuritySchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('UserSecurity', UserSecuritySchema);
