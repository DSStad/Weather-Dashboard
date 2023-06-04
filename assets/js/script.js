const cityTitle = $("#city-name");
const currentDate = $("#date");
const weatherIcon = $("#icon");
const oldSearches = $("#past-searches");
const listData = $("#output");
const currTemp = $("#temp");
const currWind = $("#wind");
const currHum = $("#hum");
let cityInput = $("#city");
const search = $("#form");
const fiveDayContainer = $("#cards-container");

let lat = "";
let lon = "";

// search.submit(function (e) {})
function geoCodeRetrieve(cityName) {
  console.log(cityName);
  // e.preventDefault();
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&limit=5&appid=b8fc387331c767a99a233c98e09002f5"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   cityTitle.textContent = "";
      console.log(data);
      lat = data[0].lat;
      lon = data[0].lon;
      let coord = [lat, lon];
      console.log(lat, lon);
      console.log(data[0].name);
      cityTitle.text(data[0].name);

      let newBtn = $("<button>")
        .text(data[0].name)
        .addClass("btn btn-primary mb-3 prev")
        .attr("id", data[0].name);
      oldSearches.prepend(newBtn);

      localStorage.setItem(data[0].name, JSON.stringify(coord));
      let prevSearch = JSON.parse(localStorage.getItem(data[0].name));
      console.log(prevSearch);

      // previousSearchBtn();
      retrieveData();
      fiveDayContainer.empty();
    });
}

function retrieveData() {
  fetch(
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=b8fc387331c767a99a233c98e09002f5"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currTemp.text("");
      currWind.text("");
      currHum.text("");
      currentDate.text("");
      weatherIcon.text("");
      console.log("weather data");
      console.log(data);
      let dt = new Date(data.current.dt * 1000);
      let wIconCode = data.current.weather[0].icon;
      let weatherIconUrl = `https://openweathermap.org/img/wn/${wIconCode}@2x.png`;
      let imgWIcon = $("<img>").attr("src", weatherIconUrl);
      console.log(data.current.weather[0].icon);

      currentDate.text(`(${dt.toDateString()})`);
      weatherIcon.append(imgWIcon);
      currTemp.text(`Temp: ${data.current.temp} °F`);
      currWind.text(`Wind: ${data.current.wind_speed} MPH`);
      currHum.text(`Humidity: ${data.current.humidity} %`);

      for (let i = 0; i < 5; i++) {
        let newUL = $("<ul>").addClass("col gx-2").css({
          "background-color": "blue",
          color: "white",
          "margin-left": "3px",
          "margin-right": "3px",
          "padding-bottom": "3px",
        });

        let fiveDT = new Date(data.daily[i].dt * 1000);
        let fiveIcon = data.daily[i].weather[0].icon;
        let fiveIconUrl = `https://openweathermap.org/img/wn/${fiveIcon}.png`;
        let fiveImg = $("<img>").attr("src", fiveIconUrl);

        let dateLi = $("<li>").text(fiveDT.toLocaleDateString());
        let iconLi = $("<li>").append(fiveImg);
        let tempLi = $("<li>").text(`Temp: ${data.daily[i].temp.day} °F`);
        let windLi = $("<li>").text(`Wind: ${data.daily[i].wind_speed} MPH`);
        let humLi = $("<li>").text(`Humidity: ${data.daily[i].humidity} %`);

        newUL.append(dateLi, iconLi, tempLi, windLi, humLi);
        fiveDayContainer.append(newUL);
      }
      $("#form")[0].reset();
    });
}

// on click for prev search btn inputting value of prevSearch into search.submit function

search.submit(function (e) {
  e.preventDefault();
  geoCodeRetrieve(cityInput.val());
});

oldSearches.on("click", function (e) {
  let prevCity = e.target;
  let prevCityName = prevCity.textContent;
  // let prevCity = this.attr("id");
  console.log(prevCity.textContent);
  geoCodeRetrieve(prevCityName);
  prevCity.remove();
});
// $(".prev").on("click");
