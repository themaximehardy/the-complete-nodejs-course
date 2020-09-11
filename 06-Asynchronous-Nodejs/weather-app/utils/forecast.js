const request = require('postman-request');

const forecast = (long, lat, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=${lat},${long}&units=m`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather service!', null);
    } else if (response.body.error) {
      callback('Unable to find location. Try another search.', null);
    } else {
      const { current, location } = response.body;
      callback(
        null,
        `${current.weather_descriptions} in ${location.name} (${location.country}). It is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out`,
      );
    }
  });
};

module.exports = forecast;
