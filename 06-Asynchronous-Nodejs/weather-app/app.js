const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=37.8267,-122.4233&units=m';

request({ url: url, json: true }, (error, response) => {
  const { current } = response.body;
  console.log(
    `It is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out`,
  );
});

const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1Ijoiam9obnNtaXRoNzgiLCJhIjoiY2tldjFsNnk4MGsyajJybWU4bmRnaWRucCJ9.2QsD-tv8oYpxB8_wVsWpcw&limit=1';

request({ url: geocodeURL, json: true }, (error, response) => {
  const { features } = response.body;
  const lat = features[0].center[1];
  const long = features[0].center[0];
  console.log(lat, long);
});
