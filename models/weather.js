const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  location_coords: {
    type: String,
    required: true,
  },

  city_requested: {
    type: String,
    required: false,
  },

  fetched_at: {
    type: Date,
    default: Date.now,
  },

  summary_data: {
    type: Object,
    required: true,
  },

  full_forecast: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Weather", weatherSchema);
