const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  axios = require("axios"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
seedDB();

app.use(bodyParser.urlencoded({
  extended: true
}));

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
      res.render("index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

//NEW-Show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
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
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("show", {
        campground: foundCampground
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server Has Started!");
});