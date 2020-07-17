const Campground = require("../models/campground");
const Comment = require("../models/comment");
let middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //Check if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //Does user owns this account
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login");
        res.redirect("back");
    }
};
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                //Does user owns this account
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login");
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to login");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;