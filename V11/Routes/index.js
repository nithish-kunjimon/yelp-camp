const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});

// =======================
// AUTHENTICATION ROUTES
// =======================

//show register form
router.get("/register", (req, res) => {
    res.render("register");
});

//Handle signup logic
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

//Show Login form
router.get("/login", (req, res) => {
    res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        successFlash: true,
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Login successful",
    }),
    (req, res) => {}
);

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/campgrounds");
});
module.exports = router;