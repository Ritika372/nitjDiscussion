const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  isAns: {
    type: Boolean,
    default: false,
  },
});

const Question = mongoose.model('question', QuestionSchema);
module.exports = Question;
