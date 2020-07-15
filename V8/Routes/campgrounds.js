const express = require("express");
(router = express.Router()), (Campground = require("../models/campground"));

//INDEX ROUTE
router.get("/", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//NEW-Show form to create new campground
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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

module.exports = router;
