const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true, require: true },
  password: { type: String },
  dateOfBirth: { type: Date },
  phoneNumber: { type: String },
  role: { type: String, require: true },
  startAddress: { type: String },
  endAddress: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
