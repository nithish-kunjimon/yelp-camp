const express = require('express'),
    router = express.Router({
        mergeParams: true
    }),
    Campground = require('../models/campground'),
    Comment = require("../models/comment"),
    middleware = require('../middleware');
//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

//Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    //looking up campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //Add username and id to comments
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });

});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTES
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.render("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;