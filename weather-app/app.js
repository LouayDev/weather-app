window.addEventListener('load', () => {
  let long;
  let lat;

  //timezone section
  let weatherTimezone = document.querySelector('.timezone');

  //weather & descreption section
  const degreeSection = document.querySelector(
    '.degree-and-description-section'
  );
  const degree = document.querySelector('.degree');
  const degreeSectionSpan = document.querySelector('.degreeSectionSpan');
  const weatherDescription = document.querySelector('.description');

  //other info section
  const weatherWindSpeed = document.querySelector('.wind');
  const weatherHumidity = document.querySelector('.humidity');
  const weatherPreasure = document.querySelector('.preasure');
  const clouds = document.querySelector('.clouds');
  const sunrise = document.querySelector('.sunrise');
  const sunset = document.querySelector('.sunset');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      /*the API provider doesn't allow users to user the API from local host,
            so we are using this URL to act like a proxy for our API request so we can use it from local host */
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      // the API key
      const apiKey = '6e35ec85966933fe78031a18b1e94845';

      //including the proxy url in the api call
      const api1 = `${proxy}api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly&appid=${apiKey}&units=metric`;

      function apiData(weatherData) {
        //getting thedate from the API
        fetch(weatherData)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            const { temp } = data.current;
            const { humidity, pressure, wind_speed } = data.current;
            const { timezone } = data;
            const { description, icon } = data.current.weather[0];

            // stting the current weather icon
            const mainIcon = document.querySelector('.icon-section');
            mainIcon.innerHTML = `<img src="icons/${icon}.svg" alt="" />`;

            // weekly forecast  section ------------------------------//
            let date = new Date().getDay();

            // sellecting all theforecast days
            const forecastdays = document.querySelectorAll('.day');
            const forecast = document.querySelectorAll('.forecast-container');

            // setting the forecast day number & day icon & day tem degree
            for (i = 1; i < 8; i++) {
              //day number
              document.querySelector(`.forecast-day-${i}`).innerHTML = date + i;
              //day temp degree
              document.querySelector(`.day${i}-degree`).innerText =
                Math.floor(data.daily[i].temp.day) + '°C';
              //day icon
              document.querySelector(
                `.day${i}-icon`
              ).innerHTML = ` <img src="icons/${data.daily[i].weather[0].icon}.svg" alt="" />`;
            }

            //setting the current day forecast
            document.querySelector(`.forecast-day-0`).innerHTML = date;
            document.querySelector(`.day0-degree`).innerText = temp + '°C';
            document.querySelector(
              `.day0-icon`
            ).innerHTML = `<img src="icons/${icon}.svg" alt="" />`;

            // adding the day names to the forecast days (cause they are jsut a number)
            forecastdays.forEach((item) => {
              let dayNumber = parseInt(parseInt(item.innerHTML));
              // slove when the day number is bigger than 6 problem
              function dayBigThan7() {
                if (dayNumber > 6) {
                  dayNumber = dayNumber - 7;
                }
              }

              dayBigThan7();
              // naming the days
              switch (dayNumber) {
                case 0:
                  item.textContent = 'Sunday';
                  break;
                case 1:
                  item.textContent = 'Monday';

                  break;
                case 2:
                  item.textContent = 'Tuesday';

                  break;
                case 3:
                  item.textContent = 'Wednesday';

                  break;
                case 4:
                  item.textContent = 'Thursday';

                  break;
                case 5:
                  item.textContent = 'Friday';

                  break;
                case 6:
                  item.textContent = 'Saturday';
              }
            });

            // changing the current data to the day data that has  been selected
            const currentForecast = document.querySelector('#forecast-current');
            forecast.forEach((item) => {
              item.addEventListener('click', () => {
                currentForecast.style.display = 'inherit';
                document.querySelector('.swiper-container').style.transform =
                  'translateX(0px)';
                setTimeout(() => {
                  currentForecast.style.opacity = '1';
                }, 100);
                degree.innerHTML = item.childNodes[5].innerText;
                mainIcon.innerHTML = item.childNodes[3].innerHTML;
                weatherDescription.textContent =
                  data.daily[parseInt(item.innerText)].weather[0].description;
                weatherPreasure.textContent =
                  data.daily[parseInt(item.innerText)].pressure + 'P';
                weatherHumidity.textContent =
                  data.daily[parseInt(item.innerText)].humidity + '%';
                weatherWindSpeed.textContent =
                  data.daily[parseInt(item.innerText)].wind_speed + 'Km/h';
                clouds.textContent =
                  data.daily[parseInt(item.innerText)].clouds + '%';
                sunset.textContent =
                  data.daily[parseInt(item.innerText)].sunset;
                sunrise.textContent =
                  data.daily[parseInt(item.innerText)].sunrise;

                document.querySelectorAll('.sun').forEach((item) => {
                  //the sunrise and the sunset foremula
                  let unix_timestamp = item.textContent;
                  // Create a new JavaScript Date object based on the timestamp
                  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                  var date2 = new Date(unix_timestamp * 1000);
                  // Hours part from the timestamp
                  var hours2 = date2.getHours();
                  // Minutes part from the timestamp
                  var minutes2 = '0' + date2.getMinutes();

                  // Will display time in 10:30:23 format
                  var formattedTime = hours2 + 'h:' + minutes2.substr(-2) + 'm';
                  item.textContent = formattedTime;
                });
              });
            });

            //ferenheit golbal formula
            let fahrenheit = temp * (9 / 5) + 32;

            function fToC() {
              //fahrenheit formula
              // switching between fahrenheit and celcious
              degreeSection.addEventListener('click', () => {
                if (degreeSectionSpan.textContent === 'C') {
                  degreeSectionSpan.textContent = 'F';
                  degree.textContent = Math.floor(fahrenheit) + '°F';
                } else {
                  degreeSectionSpan.textContent = 'C';
                  degree.textContent = temp + '°C';
                }
              });
            }
            fToC();

            //adding the border to the selected forcast contianer
            function addBorder() {
              forecast.forEach((item) => {
                item.addEventListener('click', () => {
                  for (let i = 0; i < 7; i++) {
                    forecast[i].classList.remove('border');
                  }
                  item.classList.add('border');
                });
              });
            }
            addBorder();

            // timezone section --------------------//
            weatherTimezone.textContent = timezone;

            // degree & descreption section --------------------//
            degree.textContent = temp + '°C';
            weatherDescription.textContent = description;

            // other info section --------------------//
            weatherWindSpeed.textContent = wind_speed + 'Km/h';
            weatherHumidity.textContent = humidity + '%';
            weatherPreasure.textContent = pressure + 'P';
            clouds.textContent = data.current.clouds + '%';
            sunset.textContent = data.current.sunset;
            sunrise.textContent = data.current.sunrise;
            globalTemp = temp;
            document.querySelectorAll('.sun').forEach((item) => {
              //the sunrise and the sunset foremula
              let unix_timestamp = item.textContent;
              // Create a new JavaScript Date object based on the timestamp
              // multiplied by 1000 so that the argument is in milliseconds, not seconds.
              var date2 = new Date(unix_timestamp * 1000);
              // Hours part from the timestamp
              var hours2 = date2.getHours();
              // Minutes part from the timestamp
              var minutes2 = '0' + date2.getMinutes();

              // Will display time in 10:30:23 format
              var formattedTime = hours2 + 'h:' + minutes2.substr(-2) + 'm';
              item.textContent = formattedTime;
            });
          });
      }
      apiData(api1);

      // search the weather by city name
      const input = document.querySelector('.search-city');
      const submitBtn = document.querySelector('.btn_common');

      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(input.value);
        const api2 = `${proxy}api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}`;
        fetch(api2)
          .then((response) => {
            return response.json();
          })
          .then((data2) => {
            console.log(data2);
            const cityLat = data2.city.coord.lat;
            const cityLon = data2.city.coord.lon;
            const api3 = `${proxy}api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly&appid=${apiKey}&units=metric`;
            input.value = '';
            apiData(api3);
            fetch(api3)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                const { temp } = data.current;
                let fahrenheit = temp * (9 / 5) + 32;
                function fToC() {
                  //fahrenheit formula
                  // switching between fahrenheit and celcious
                  degreeSection.addEventListener('click', () => {
                    if (degreeSectionSpan.textContent === 'C') {
                      degreeSectionSpan.textContent = 'F';
                      degree.textContent = Math.floor(fahrenheit) + '°F';
                    } else {
                      degreeSectionSpan.textContent = 'C';
                      degree.textContent = temp + '°C';
                    }
                  });
                }
                fToC();
              });
          });
      });
    });
  }
});

// creaing the darkmode switch
var checkbox = document.querySelector('input[name=checkbox]');
checkbox.addEventListener('change', function () {
  if (!this.checked) {
    document.body.style.setProperty('--text-color', '#e2f3f5');
    document.body.style.setProperty('--text-Darkblue', '#3d5af1');
    document.body.style.setProperty('--text-blue', '#22d1ee');
    document.body.style.setProperty('--white', '#fafafafa');

    document.body.style.setProperty('--text-inverse', '#0e153a');
  } else if (this.checked) {
    document.body.style.setProperty('--text-inverse', ' #e2f3f5');
    document.body.style.setProperty('--text-blue', '#3d5af1');
    document.body.style.setProperty('--white', '#3d5af1');

    document.body.style.setProperty('--text-color-Darkblue', '#22d1ee');
    document.body.style.setProperty('--text-color', '#0e153a');
  }
});

// adding the perloader
$(window).on('load', function () {
  // makes sure the whole site is loaded

  $('.preloader').fadeOut(); // will first fade out the loading animation
  $('.preloader-wrapper').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
  $('body').delay(350).css({ overflow: 'visible' });
});

// anisilizing the siwper librery
let swiper = new Swiper('.swiper-container', {
  slidesPerView: 4,

  spaceBetween: 40,
  freeMode: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
