const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  axios = require("axios"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require('./models/user'),
  seedDB = require("./seeds");

//Requiring Routes  
const campgroundRoutes = require("./Routes/campgrounds"),
  commentRoutes = require("./Routes/comments"),
  indexRoutes = require("./Routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//seedDB(); //Seeds the database

//Passport Configuration
app.use(require('express-session')({
  secret: "Javascript is a brilliant language",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Server Has Started!");
});