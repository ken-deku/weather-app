import { API_KEY } from './config.js';

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = API_KEY;

weatherForm.addEventListener("submit", async event =>{

  event.preventDefault();


  const city = cityInput.value.trim();

  if(city){
      try {
          const WeatherData = await getWeatherData(city);
          displayWeatherInfo(WeatherData);
      }
      catch (error) {
          console.error(error);
          displayError(error)
      }
  } else{
    displayError("Please Enter A city");
  }
})

async function getWeatherData(city){

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiURL);
    console.log(response)

    if (!response.ok) {
      throw new Error("Unable to locate Weather Data");
    }

    return await response.json();
}

function displayWeatherInfo(data){

    const{name: city,
          main: {temp, humidity},
          weather:[{description, id}]} = data;

    card.textContent='';
    card.style.display = "flex"

    const cityDisplay = document.createElement("h1")
    const tempDisplay = document.createElement("p")
    const humidityDisplay = document.createElement("p")
    const descDisplay = document.createElement("p")
    const weatherEmoji = document.createElement("p")

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * 9/5 + 32).toFixed(0)} °F`;
    humidityDisplay.textContent = `≋ Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");


    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    card.classList.remove("visible");
    void card.offsetWidth; // Force reflow
    card.classList.add("visible");

}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case (weatherId >= 200 && weatherId < 300): // Thunderstorm
      return "⛈️";
    case (weatherId >= 300 && weatherId < 400): // Drizzle
      return "🌧️";
    case (weatherId >= 500 && weatherId < 600): // Rain
      return "🌧️";  // change from ❄️ to rain emoji
    case (weatherId >= 600 && weatherId < 700): // Snow
      return "❄️";
    case (weatherId >= 700 && weatherId < 800): // Atmosphere
      return "🌫️"; // fog emoji
    case (weatherId === 800): // Clear
      return "☀️";
    case (weatherId > 800 && weatherId < 900): // Clouds
      return "🌥️";
    default:
      return "❓";
  }
}

function displayError(message){
    const errorDisplay= document.createElement("p")
    errorDisplay.textContent= message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent="";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}