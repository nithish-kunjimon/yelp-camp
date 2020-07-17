const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require('../middleware');

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user.id,
        username: req.user.username,
    };
    let newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author,
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground created successfully");
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
//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground,
            });
        }
    });
});
//UPDATE ROUTE
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                res.redirect("/campgrounds");
            }
            req.flash("success", "Campground updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    );
});

//DESTROY ROUTE
// router.delete("/:id", (req, res) => {
//     Campground.findOneAndDelete(req.params.id, (err) => {
//         if (err) {
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds");
//         }

//     });
// });
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        req.flash("success", "Campground deleted successfully");
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});
module.exports = router;