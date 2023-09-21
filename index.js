const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const countryList = require("country-list");
const app = express();

const apiKey = "d9fdb8774c0104b0d77561877e4dda6c";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("views", __dirname + "/public");


app.get("/", (req, res) => {
  res.render("index", {
    weather: null,
    city: null,
    weatherIcon: null,
    weatherStatus: null,
    country: null,
    error: null,
  });
});

app.post("/", (req, res) => {
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  request(url, (err, response, body) => {
    if (err) {
      res.render("index", {
        weather: null,
        city: null,
        weatherIcon: null,
        weatherStatus: null,
        country: null,
        error: "Error, Please try again",
      });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          city: null,
          weatherIcon: null,
          weatherStatus: null,
          country: null,
          error: "Error, Please try again",
        });
      } else {
        let weatherText = weather.main.temp;
        let weatherStatus = weather.weather[0].description;
        let weatherCountry = weather.sys.country;
        weatherCountry = countryList.getName(weatherCountry);
        let weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

        res.render("index", {
          weather: weatherText,
          city: weather.name,
          weatherIcon: weatherIcon,
          weatherStatus: weatherStatus,
          country: weatherCountry,
          error: null,
        });
      }
    }
  });
});

app.listen(9000, () => {
  console.log("server berjalan di port 9000");
});
