// models/OtpReset.js
const mongoose = require('mongoose');

const otpResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});
otpResetSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model('OtpReset', otpResetSchema);
