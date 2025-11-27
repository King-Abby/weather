const axios = require("axios");
const Weather = require("../models/weather"); 
const API_KEY = process.env.TOMORROW_IO_API_KEY;
const LOCATION_COORDS = process.env.TOMORROW_IO_LOCATION;
const BASE_URL = "https://api.tomorrow.io/v4/weather/forecast";

exports.getWeatherByCity = async (req, res) => {
  const requestedCity = req.params.city;


  if (!API_KEY || !LOCATION_COORDS) {
    return res
      .status(500)
      .json({
        error: "Server configuration error: Missing API Key or Location.",
      });
  }


  const params = {
    location: LOCATION_COORDS,
    apikey: API_KEY,
    units: "metric",
    fields: [
      "temperature",
      "temperatureApparent",
      "precipitationType",
      "weatherCode",
    ],
    timesteps: ["1h", "1d"],
  };
  // -----------------------------------------------------------

  try {
    const response = await axios.get(BASE_URL, { params });
    const forecastData = response.data.timelines;

    
    // This value is needed for the simplifiedForecast and the database save
    const currentTemperature = forecastData.daily[0].values.temperatureAvg;
    // ------------------------------------------------------

    const simplifiedForecast = {
      requested_city: requestedCity,
      coordinates: LOCATION_COORDS,
      current_temperature: currentTemperature, 
      daily_forecast: forecastData.daily,
      hourly_forecast_start: forecastData.hourly[0],
    };

    const newWeatherRecord = await Weather.create({
      location_coords: LOCATION_COORDS,
      city_requested: requestedCity,
      summary_data: {
        temp: currentTemperature,
        weather_code:
          simplifiedForecast.hourly_forecast_start.values.weatherCode,
      },
      full_forecast: forecastData,
    });

    console.log(
      `✅ Successfully saved new weather record (ID: ${newWeatherRecord._id})`
    );
    res.json(simplifiedForecast);
  } catch (error) {
    console.error("DATABASE SAVE/FETCH FAILED:", error);
    res.status(500).json({ error: "Failed to fetch or save data." });
  }
};
