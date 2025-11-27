const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const connectDB = require("./config/connectDb");
const weatherRoutes = require("./routes/weather");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/weather", weatherRoutes);


app.get("/", (req, res) => {
  res.send("Weather API Backend is running. Try /api/weather/London");
});

const port = 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
  console.log(
    `API Key Status: ${process.env.TOMORROW_IO_API_KEY ? "Loaded" : "FAILED"}`
  );
});
