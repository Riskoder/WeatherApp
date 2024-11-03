const $location = document.querySelector('.location');
const $date = document.querySelector('.datetime');
const $grades = document.querySelector('.grade');
const $conditions = document.querySelector('.conditions');
const $humidity = document.querySelector('.humidity-info');
const $rain = document.querySelector('.rain-info');
const $wind = document.querySelector('.wind-info');
const errorMessage = document.querySelector('.error');

const API_KEY = 'XEVRDFATMBEWW4KCX5QVUMHAL';

//llamada al servicio de la api:
const weatherService = (apiKey) => {
  const fetchWeatherInfo = async (city) => {
    const query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${
      city || 'Santiago'
    }?key=${apiKey}`;

    const response = await fetch(query);
    if (!response.ok) {
      errorMessage.textContent = 'The city has not been found.';
      throw new Error('Error Al llamar a la API');
    }

    errorMessage.textContent = '';

    const data = await response.json();

    return processData(data);
  };

  const processData = (data) => {
    const [city, location, country] = data.resolvedAddress.split(', ');
    const gradesCelsius = convertToCelsius(data.currentConditions.temp);
    return {
      city,
      country,
      time: data.currentConditions.datetime,
      gradesCelsius,
      condition: data.currentConditions.conditions,
      humidity: data.currentConditions.humidity,
      rainProb: data.currentConditions.precip || '0',
      windSpeed: data.currentConditions.windspeed,
    };
  };

  const convertToCelsius = (fahrenheit) => {
    return Math.round((fahrenheit - 32) * (5 / 9) * 10) / 10;
  };

  return { fetchWeatherInfo };
};

//Manejo del DOM
const weatherUI = () => {
  const showInfo = (weatherInfo) => {
    $location.textContent = weatherInfo.city + ', ' + weatherInfo.country;
    $date.textContent = weatherInfo.time;
    $grades.textContent = weatherInfo.gradesCelsius + '°c';
    $conditions.textContent = weatherInfo.condition;
    $rain.textContent = weatherInfo.rainProb + '%';
    $wind.textContent = weatherInfo.windSpeed + ' km/h';
    $humidity.textContent = weatherInfo.humidity + '%';
  };

  return { showInfo };
};

//Orquestador:
const weatherApp = (apiKey) => {
  const weatherServices = weatherService(apiKey);
  const weatherUIs = weatherUI();

  const searchWeather = async (city) => {
    try {
      const data = await weatherServices.fetchWeatherInfo(city);
      weatherUIs.showInfo(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return { searchWeather };
};

// Inicializador

const createWeatherApp = weatherApp(API_KEY);
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('searchBar').value;
  createWeatherApp.searchWeather(city);
});

const searchBtn = document.getElementById('search');
searchBtn.addEventListener('click', () => {
  const city = document.getElementById('searchBar').value;
  createWeatherApp.searchWeather(city);
});

createWeatherApp.searchWeather('Santiago');
