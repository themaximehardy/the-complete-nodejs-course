const request = require('postman-request');

const forecast = (long, lat, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=${lat},${long}&units=m`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!');
    } else if (body.error) {
      callback('Unable to find location. Try another search.');
    } else {
      const { current, location } = body;
      callback(
        undefined,
        `${current.weather_descriptions} in ${location.name} (${location.country}). It is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out`,
      );
    }
  });
};

module.exports = forecast;
