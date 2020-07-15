const express = require('express');
router = express.Router(),
    Campground = require('../models/campground');

//INDEX ROUTE
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

//NEW-Show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user.id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;