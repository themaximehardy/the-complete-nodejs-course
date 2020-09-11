const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const location = process.argv[2];

if (!location) {
  console.log('Please provide a location.');
} else {
  geocode(location, (error, data) => {
    if (error) {
      return console.log(error);
    }
    const { lat, long } = data;
    forecast(long, lat, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }
      console.log(data.location);
      console.log(forecastData);
    });
  });
}
