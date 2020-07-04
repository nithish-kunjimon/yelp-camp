const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

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

app.use(bodyParser.urlencoded({
  encoded: true
}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("landing");
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {
    campgrounds: campgrounds
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.post('/campgrounds', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {
    name: name,
    image: image
  };
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});


app.listen(3000, () => {
  console.log("Server Has Started!");
});