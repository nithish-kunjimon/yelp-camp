const express = require("express");
const app = express();
const axios = require("axios");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  let campgrounds = [{
      name: "Salmon Creek",
      image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
      name: "James Cameron",
      image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
      name: "Alex Gardner",
      image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440762778d19f4acc_340.jpg",
    },
  ];
  res.render("campgrounds", {
    campgrounds: campgrounds
  });
});

app.listen(3000, function () {
  console.log("Server Has Started!");
});