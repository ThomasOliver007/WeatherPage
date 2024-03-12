import React, { useEffect, useState } from "react";
import "./App.css";

const apiKey = "0d709154de5f1ad15b224d8f2647f843";

const cities = [
  { name: "Berlin", lat: 52.52, lon: 13.405 },
  { name: "Budapest", lat: 47.497912, lon: 19.040235 },
  { name: "Sombor", lat: 45.7747, lon: 19.1157 },
  { name: "Yellowknife", lat: 62.453972, lon: -114.371788 },
];

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [forecastType, setForecastType] = useState("current");
  const [weatherData, setWeatherData] = useState(null);
  console.log("weatherData:", weatherData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl;
        if (forecastType === "current") {
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=metric`;
        }
        if (forecastType === "forecast") {
          apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&appid=${apiKey}&lon=${selectedCity.lon}&units=metric`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();

        if (data) {
          console.log("data:", data);
          console.log("forecastType:", forecastType);
          let extractedData;
          if (forecastType === "current") {
            extractedData = data;
          }
          if (forecastType === "forecast") {
            extractedData = data.list[0]; // INSTEAD OF EXTRACTING ONLY 1ST VALUE, YOU CAN CHANGE THIS AND LIST 3-HOURS FORECAST
          }

          setWeatherData(extractedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedCity, forecastType]);

  return (
    <div className="container_weather-page">
      <h1 className="page-title">Weather Forecast</h1>

      <div className="settlement-selection">
        <label htmlFor="city">Select City:</label>
        <select
          id="city"
          className="form-select"
          value={selectedCity.name}
          onChange={(e) => {
            const city = cities.find((c) => c.name === e.target.value);
            setSelectedCity(city);
          }}
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="forecast-selection">
        <label htmlFor="forecastType">Choose Forecast Type:</label>
        <select
          id="forecastType"
          className="form-select"
          value={forecastType}
          onChange={(e) => setForecastType(e.target.value)}
        >
          <option value="current">Current Weather</option>
          <option value="forecast">5-Day/3-Hour Forecast</option>
        </select>
      </div>

      {/* <button
        className="btn-style"
        onClick={downloadForecast}
        disabled={!weatherData}
      >
        Download Forecast
      </button> */}

      {weatherData && (
        <div className="weather-data">
          <h2>{selectedCity.name} Weather Details</h2>
          <p>Minimum Temperature: {weatherData.main?.temp_min}°C</p>
          <p>Maximum Temperature: {weatherData.main?.temp_max}°C</p>
          {forecastType === "current" && (
            <>
              <p>Precipitation: {weatherData.weather[0]?.description}</p>
              <p>Wind Speed: {weatherData.wind?.speed} m/s</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
