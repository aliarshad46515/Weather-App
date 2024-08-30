"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const weatherIconMap = {
    'clear sky': 'fa-sun',
    'few clouds': 'fa-cloud-sun',
    'scattered clouds': 'fa-cloud',
    'broken clouds': 'fa-cloud',
    'overcast clouds': 'fa-cloud',
    'shower rain': 'fa-cloud-showers-heavy',
    'rain': 'fa-cloud-rain',
    'light rain': 'fa-cloud-rain',
    'moderate rain': 'fa-cloud-showers-heavy',
    'heavy intensity rain': 'fa-cloud-showers-heavy',
    'very heavy rain': 'fa-cloud-showers-heavy',
    'extreme rain': 'fa-cloud-showers-heavy',
    'freezing rain': 'fa-snowflake',
    'light intensity shower rain': 'fa-cloud-rain',
    'heavy intensity shower rain': 'fa-cloud-showers-heavy',
    'ragged shower rain': 'fa-cloud-showers-heavy',
    'thunderstorm': 'fa-bolt',
    'thunderstorm with light rain': 'fa-bolt',
    'thunderstorm with rain': 'fa-bolt',
    'thunderstorm with heavy rain': 'fa-bolt',
    'light thunderstorm': 'fa-bolt',
    'heavy thunderstorm': 'fa-bolt',
    'ragged thunderstorm': 'fa-bolt',
    'thunderstorm with light drizzle': 'fa-bolt',
    'thunderstorm with drizzle': 'fa-bolt',
    'thunderstorm with heavy drizzle': 'fa-bolt',
    'snow': 'fa-snowflake',
    'light snow': 'fa-snowflake',
    'heavy snow': 'fa-snowflake',
    'sleet': 'fa-cloud-meatball',
    'light shower sleet': 'fa-cloud-meatball',
    'shower sleet': 'fa-cloud-meatball',
    'light rain and snow': 'fa-cloud-rain',
    'rain and snow': 'fa-cloud-rain',
    'light shower snow': 'fa-cloud-snow',
    'shower snow': 'fa-cloud-snow',
    'heavy shower snow': 'fa-cloud-snow',
    'mist': 'fa-smog',
    'smoke': 'fa-smog',
    'haze': 'fa-smog',
    'fog': 'fa-smog',
    'sand': 'fa-smog',
    'dust': 'fa-smog',
    'volcanic ash': 'fa-smog',
    'squalls': 'fa-wind',
    'tornado': 'fa-wind',
    'hurricane': 'fa-wind',
    'cold': 'fa-temperature-low',
    'hot': 'fa-temperature-high',
    'windy': 'fa-wind',
    'hail': 'fa-cloud-meatball',
  };

  const search = document.querySelector(".search-btn");
  const input = document.getElementById("search-input");
  const city = document.querySelector(".weather-city");
  const temp = document.querySelector(".temp");
  const des = document.querySelector(".des");
  const minTemp = document.getElementById("min-temp");
  const maxTemp = document.getElementById("max-temp");
  const quality = document.querySelector('.quality');
  const humidity = document.querySelector('.humidity');
  const windSpeed = document.querySelector('.speed');  
  const sunrise = document.querySelector('.sunrise');
  const sunset = document.querySelector('.sunset');  
  const uvIndex = document.querySelector('.uv-quality');
  const feelslike = document.querySelector('.feels-like-value');
  const API_KEY = process.env.SECRET_KEY;

  function getWeather() {
    var latitude;
    var longitude;
    const value = input.value;
    const urlValue = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=${API_KEY}`;

    fetch(urlValue)
      .then((response) => response.json())
      .then((response) => {        
        const rise = new Date(response.sys.sunrise * 1000).toTimeString().substr(0, 5);
        const set = new Date(response.sys.sunset * 1000).toTimeString().substr(0, 5);
        const unixTime = response.dt + response.timezone;
        const visibility = response.visibility / 1000;
        city.textContent = response.name;
        temp.textContent = `${Math.round(response.main.temp)}°`;
        des.textContent = response.weather[0].description;
        minTemp.textContent = `L: ${Math.round(response.main.temp_min)}°`;
        maxTemp.textContent = `H: ${Math.round(response.main.temp_max)}°`;
        humidity.textContent = `${response.main.humidity}`;
        feelslike.textContent = `${Math.round(response.main.feels_like)}°`;
        windSpeed.textContent = `${response.wind.speed}`;        
        sunrise.textContent = "Sunrise: " + rise;
        sunset.textContent = "Sunset: " + set;
        latitude = parseFloat(response.coord.lat);
        longitude = parseFloat(response.coord.lon);

        getForecast();
        airQuality(latitude, longitude);
        toggleSunriseSunset();        
        const info = document.querySelector('.side-cont');
        value !== "" ? info.style.display = 'flex' : info.style.display = 'none';
        document.body.style.height = '100%';
      })
      .catch((error) => console.log(error));
  }

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getWeather();
    }
  });

  search.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather();
  });

  function getForecast() {
    const value = input.value;
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let list = document.querySelector('.hourly-list');                
        if (list.childElementCount)
          list.replaceChildren();
        for (let i = 0; i <= 5; i++) {
          let foreTime = document.querySelector('.fore-time-' + i);
          let foreTemp = document.querySelector('.fore-temp-' + i);
          let foreIcon = document.querySelector('.fore-icon-' + i);


          const index = i * 8;

          const forecastDate = new Date(response.list[index].dt * 1000);

          const weekday = forecastDate.toLocaleString("en-US", {
            weekday: "short",
          });

          const weatherDescription =
            response.list[index].weather[0].description;

          let time = document.createElement('div');
          time.classList.add('fore-time-' + i);
          let icon = document.createElement('div');
          icon.classList.add('fore-icon-' + i);

          let temper = document.createElement('div');
          temper.classList.add('fore-temp-' + i);

          time.classList.add('list');

          const temp = Math.round(response.list[index].main.temp);
          const iconClass = weatherIconMap[weatherDescription] || 'fa-question-circle';
          time.textContent = weekday;
          icon.innerHTML = `<i class="fas ${iconClass}"></i>`;
          temper.textContent = `${temp}°`;
          let item = document.createElement('div');
          item.classList.add('item');

          item.appendChild(time);
          item.appendChild(icon);
          item.appendChild(temper);
          list.appendChild(item);
          if (weekday === new Date().toLocaleString('eng-US', { weekday: 'short' })) {
            time.parentElement.classList.add('today');
          }
        }
      })
      .catch((error) => console.log(error));
  }

  function airQuality(latitude, longitude) {
    console.log(latitude, longitude)
    fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => {
        quality.textContent = `${response.list[0].main.aqi}`;
      })
      .catch((error) => console.log(error));
    fetch(
      `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => {
        uvIndex.textContent = `${response.value}`;
      })
      .catch((error) => console.log(error));
  }

  //Sun Display 
  function toggleSunriseSunset() {
    function handleToggle() {
      if (window.innerWidth <= 760) {
        sunrise.style.display = 'block';
        sunset.style.display = 'none';

        let isSunriseVisible = true;

        setInterval(() => {
          if (isSunriseVisible) {
            sunrise.style.display = 'none';
            sunset.style.display = 'block';
            isSunriseVisible = false;

            setTimeout(() => {
              sunset.style.display = 'none';
            }, 6000);
          } else {
            sunrise.style.display = 'block';
            isSunriseVisible = true;
          }
        }, 6000);
      } else {
        clearInterval();
        sunrise.style.display = '';
        sunset.style.display = '';
      }
    }
    handleToggle();
    window.addEventListener('resize', handleToggle);
  }
});