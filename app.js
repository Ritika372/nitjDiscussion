require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Question = require('./Model/Question');
const Student = require('./Model/Student');
const bcrypt = require('bcrypt');

//TODO: increase the rounds
const salting_rounds = 1;

const app = express();

let currUser = Student.find({ email: 'ritikagoyal372@gmail.com' });

app.set('view engine', 'ejs');
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));

//CONNECT DATABASE
const url = `${process.env.DATABASE}`;
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(url, connectionParams, function (err) {
  if (!err) console.log('connected!');
});

//MAIN PAge which is login signup
app.get('/login', function (req, res) {
  res.render('index');
});

//display login/signup page
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/landing', function (req, res) {
  res.render('landing', { name: currUser.name });
});

//home page where questions will be displayed.
app.get('/home', function (req, res) {
  Question.find({ isAns: true }, function (err, question) {
    if (err) console.log('error');
    else {
      res.render('home', { name: currUser.name, question: question });
    }
  });
});

//login setup
app.post('/login', function (req, res) {
  const email = req.body.email;
  const pass = req.body.password;
  //console.log(email, pass);
  //hashing;
  Student.findOne({ email: email }, (err, foundStudent) => {
    if (err) {
      res.send('Something Wrong Happened');
      console.log(err);
    } else {
      if (foundStudent) {
        bcrypt.compare(pass, foundStudent.password, (err, result) => {
          if (result) {
            console.log(result, 'found one');
            currUser = foundStudent;

            //Redirecting to the student profile
            res.redirect('/landing');
          } else if (err) {
            console.log(err);
          }
        });
      } else {
        res.send('First Register yourself');
      }
    }
  });
});

// //signup
app.post('/register', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let branch = req.body.branch;
  let rollNo = req.body.rollNo;
  let name = req.body.name;
  console.log(email, password);
  bcrypt.hash(password, salting_rounds, (err, hash) => {
    const newStudent = new Student({
      email: email,
      password: hash,
      name: name,
      rollNo: rollNo,
      branch: branch,
    });
    newStudent.save((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('student registered!');
        res.redirect('/login');
      }
    });
  });
});

//ask question
app.get('/ask', function (req, res) {
  res.render('askQuestion', { name: currUser.name });
});

app.post('/ask', function (req, res) {
  const que = new Question({
    question: req.body.ques,
  });
  que.save();
  res.redirect('/home');
});

//answer question
app.get('/answer', function (req, res) {
  Question.find({ isAns: false }, function (err, question) {
    if (err) console.log('error');
    else {
      res.render('unAnswered', { name: currUser.name, question: question });
    }
  });
});

app.post('/answer', function (req, res) {
  //get question id;
  console.log(`/ansQue/${req.body.queId}`);
  res.redirect(`/ansQue/${req.body.queId}`);
  //update que
});

//answer current questino
app.get('/ansQue/:queId', function (req, res) {
  //console.log(req.params.queId);
  Question.findById(req.params.queId, function (err, que) {
    if (err) console.log(err);
    else {
      //console.log(que);
      res.render('ansQuestion', {
        name: currUser.name,
        question: que.question,
        id: que._id,
      });
    }
  });
});

app.post('/ansQue/:queId', function (req, res) {
  console.log('hello i ma here');
  Question.findByIdAndUpdate(
    req.params.queId,
    { answer: req.body.ans, isAns: true },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('updated successfully');
        res.redirect('/home');
      }
    }
  );
});

//videoCall
app.get('/videocall', function (req, res) {
  res.render('videoCall', { name: currUser.name });
});

//exam time
app.get('/examTime', function (req, res) {
  res.render('notes', { name: currUser.name });
});

//campus
app.get('/campus', function (req, res) {
  res.render('camp', { name: currUser.name });
});

//listen to port
app.listen(3000, function () {
  console.log('server started on port 3000');
});
