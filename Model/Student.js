const { truncate } = require('fs');
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model('student', StudentSchema);
module.exports = Student;
