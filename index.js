// imports
const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('js-md5');
const app = express();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
});
const User = mongoose.model('User', userSchema);

// default settings
app.use(body.urlencoded({
  extended: true
}));

mongoose.connect('mongodb+srv://Tanmay:tanmay123@cluster0.ztdx8.mongodb.net/login?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
// this will print errors if there are any.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're Connected to DB");
});

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/views/home.html")
});

app.get("/login", (req, res) => {
  return res.sendFile(__dirname + "/views/login.html")
});

app.get("/signup", (req, res) => {
  return res.sendFile(__dirname + "/views/signup.html")
});

app.post("/signup", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);

  const user = new User({
    email: email,
    password: md5(password),
  });

  var flag = 0;
  User.findOne({
    email: email
  }, (err, user_1) => {
    if (user_1) {
      console.log(user_1);
      return res.send("User Already Exists!");
    }
    else {
      user.save(); // account saved.
      return res.redirect('/');
    }
  });
});

app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);

  User.findOne({
    email: email
  }, (err, user_1) => {
    if (!user_1) {
      return res.send("User Does Not Exist");
    } else {
      if (user_1.password === md5(password)) {
        res.redirect('/'); // login successful
      } else {
        return res.send("Passwords Do Not Match!");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server started!");
});
