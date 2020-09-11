const request = require('postman-request');

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address,
  )}.json?access_token=pk.eyJ1Ijoiam9obnNtaXRoNzgiLCJhIjoiY2tldjFsNnk4MGsyajJybWU4bmRnaWRucCJ9.2QsD-tv8oYpxB8_wVsWpcw&limit=1`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to mapbox service!', null);
    } else if (response.body.features.length === 0) {
      callback('Unable to find location. Try another search.', null);
    } else {
      const { features } = response.body;
      const lat = features[0].center[1];
      const long = features[0].center[0];
      const location = features[0].place_name;
      callback(null, { lat, long, location });
    }
  });
};

module.exports = geocode;
