// DOM Elements
const enterCity = document.getElementById('city-input');
const findWeather = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const locationDisplay = document.getElementById('location');
const dateDisplay = document.getElementById('date');
const tempDisplay = document.getElementById('temperature');
const conditionsDisplay = document.getElementById('conditions');
const humidityDisplay = document.getElementById('humidity');
const windDisplay = document.getElementById('wind');
const feelsLikeDisplay = document.getElementById('feels-like');
const weatherIcon = document.getElementById('weather-icon');
const errorDisplay = document.getElementById('error-message');
const forecastContainer = document.getElementById('forecast-items');

// API Configuration
import { API_KEY } from './config.js';
const apiKey = API_KEY;

const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'; // 5-day forecast with 3-hour intervals

// Initializing app
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  getCurrentLocationWeather();
});

// Updating current date
function updateDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplay.textContent = new Date().toLocaleDateString(undefined, options);
}

// Getting weather forecast data
async function getWeatherForecast(lat, lon) {
  try {
    const response = await fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Forecast data not available');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Getting weather by coordinates (current location)
async function getWeatherByCoords(lat, lon) {
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${currentWeatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      getWeatherForecast(lat, lon)
    ]);
    
    if (!currentResponse.ok) throw new Error('Weather data not available');
    
    return {
      current: await currentResponse.json(),
      forecast: await forecastResponse
    };
  } catch (error) {
    throw error;
  }
}

// Getting weather by city name
async function getWeatherByCity(city) {
  try {
    // First getting coordinates for the city
    const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    if (!geoResponse.ok) throw new Error('City not found');
    
    const geoData = await geoResponse.json();
    if (!geoData.length) throw new Error('City not found');
    
    const { lat, lon } = geoData[0];
    return await getWeatherByCoords(lat, lon);
  } catch (error) {
    throw error;
  }
}

// Displaing weather data
function displayWeather(data) {
  // Current weather
  locationDisplay.textContent = `${data.current.name}, ${data.current.sys.country}`;
  tempDisplay.textContent = `${Math.round(data.current.main.temp)}°C`;
  conditionsDisplay.textContent = data.current.weather[0].description;
  humidityDisplay.textContent = `${data.current.main.humidity}%`;
  windDisplay.textContent = `${Math.round(data.current.wind.speed * 3.6)} km/h`;
  feelsLikeDisplay.textContent = `${Math.round(data.current.main.feels_like)}°C`;
  
  // Weather icon
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" 
                          alt="${data.current.weather[0].description}">`;
  
  // Clearing any errors
  errorDisplay.textContent = '';
  
  // Displyaing forecast
  displayForecast(data.forecast);
}

// Displaying forecast data
function displayForecast(forecastData) {
  forecastContainer.innerHTML = '';
  
  if (!forecastData || !forecastData.list) {
    console.error('No forecast data available');
    return;
  }
  
  // Processing forecast data to get daily values
  const dailyForecast = {};
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateString = date.toLocaleDateString();
    
    if (!dailyForecast[dateString]) {
      dailyForecast[dateString] = {
        date: date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
        count: 1
      };
    } else {
      dailyForecast[dateString].temp_min = Math.min(dailyForecast[dateString].temp_min, item.main.temp_min);
      dailyForecast[dateString].temp_max = Math.max(dailyForecast[dateString].temp_max, item.main.temp_max);
      dailyForecast[dateString].count++;
    }
  });
  
  // Displaying forecast for next 10 days (or as many as available)
  const forecastDays = Object.values(dailyForecast).slice(0, 10);
  
  forecastDays.forEach(day => {
    const dayName = day.date.toLocaleDateString(undefined, { weekday: 'short' });
    const weatherCondition = day.weather.main.toLowerCase();
    
    // Choosing appropriate icon based on weather condition
    let weatherIcon = '';
    if (weatherCondition.includes('rain')) {
      weatherIcon = '🌧️';
    } else if (weatherCondition.includes('cloud')) {
      weatherIcon = '☁️';
    } else if (weatherCondition.includes('snow')) {
      weatherIcon = '❄️';
    } else {
      weatherIcon = '☀️';
    }
    
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    forecastItem.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <div class="forecast-icon">${weatherIcon}</div>
      <div class="forecast-temp">
        <span class="forecast-temp-max">${Math.round(day.temp_max)}°</span>
        <span class="forecast-temp-min">${Math.round(day.temp_min)}°</span>
      </div>
      <div class="forecast-conditions">${day.weather.description}</div>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

// Getting weather for current location
function getCurrentLocationWeather() {
  locationDisplay.textContent = 'Detecting your location...';
  errorDisplay.textContent = '';
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await getWeatherByCoords(latitude, longitude);
          displayWeather(weatherData);
        } catch (error) {
          errorDisplay.textContent = error.message;
          locationDisplay.textContent = 'Weather App';
        }
      },
      (error) => {
        errorDisplay.textContent = 'Location access denied. Please search for a city.';
        locationDisplay.textContent = 'Weather App';
      }
    );
  } else {
    errorDisplay.textContent = 'Geolocation is not supported by your browser. Please search for a city.';
  }
}

// Event Listeners
findWeather.addEventListener('click', async () => {
  const city = enterCity.value.trim();
  if (city) {
    try {
      const weatherData = await getWeatherByCity(city);
      displayWeather(weatherData);
      enterCity.value = '';
    } catch (error) {
      errorDisplay.textContent = error.message;
    }
  } else {
    errorDisplay.textContent = 'Please enter a city name';
  }
});

enterCity.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const city = enterCity.value.trim();
    if (city) {
      try {
        const weatherData = await getWeatherByCity(city);
        displayWeather(weatherData);
        enterCity.value = '';
      } catch (error) {
        errorDisplay.textContent = error.message;
      }
    } else {
      errorDisplay.textContent = 'Please enter a city name';
    }
  }
});

currentLocationBtn.addEventListener('click', getCurrentLocationWeather);