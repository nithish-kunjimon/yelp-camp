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

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
seedDB();

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

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX ROUTE
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser:req.user
      });
    }
  });
});

//NEW-Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//CREATE ROUTE
app.post("/campgrounds", (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {
    name: name,
    image: image,
    description: desc,
  };
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
  //find the campground with provided Id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", {
          campground: foundCampground,
        });
      }
    });
});

// ============================
// COMMENT ROUTES
// ============================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground: campground,
      });
    }
  });
});

app.post("/campgrounds/:id/comments",isLoggedIn, (req, res) => {
  //looking up campground using id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// =======================
// AUTHENTICATION ROUTES
// =======================

//show register form
app.get('/register', (req, res) => {
  res.render('register');
});

//Handle signup logic
app.post('/register', (req, res) => {
  let newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/register');
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

//Show Login form
app.get('/login', (req, res) => {
  res.render('login');
});

//Handling login logic
app.post('/login', passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {});

//Logout Route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, () => {
  console.log("Server Has Started!");
});