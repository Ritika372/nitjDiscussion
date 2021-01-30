const express = require('express');
const mongoose = require('mongoose');
const Question = require('./Model/Question');

const app = express();

//TODO change home link
app.get('/', function (req, res) {
  //display all the questions which are answered
  Question.find({ isAnswered: true }, function (err, question) {
    if (err) console.log('error');
    else console.log(question);
  });
});
