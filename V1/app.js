const express = require("express");
const app = express();
const axios = require("axios");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  let campgrounds = [
    {
      name: "Salmon Creek",
      image:
        "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254784a722b73d09345_340.jpg",
    },
    {
      name: "James Cameron",
      image:
        "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
    },
    {
      name: "Alex Gardner",
      image:
        "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e50744076287fdc9349cd_340.jpg",
    },
  ];
  res.render("campgrounds", { campgrounds: campgrounds });
});

app.listen(3000, function () {
  console.log("Server Has Started!");
});
