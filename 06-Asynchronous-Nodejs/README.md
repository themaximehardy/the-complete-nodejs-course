# Asynchronous Node.js (Weather App)

### 1. Introduction

If you read about Nodejs, you're likely going to see these same 4 terms pop up over and over again:

- asynchronous
- non-blocking
- single threaded
- event driven

The question is what exactly do those terms mean and how are they going to impact the Nodejs apps we're building.

### 2. Asynchronous Basics

Let's build our first asynchronous non-blocking Nodejs application. By non-blocking I mean our app is going to continue to be able to do other things while it's waiting for some long running I/O processes to complete.

```js
console.log('Starting');

// one of the most basic asynchronous functions that Nodejs provides
setTimeout(() => {
  console.log('2 Sec Timer');
}, 2000);

setTimeout(() => {
  console.log('0 Sec Timer');
}, 0);

console.log('Stopping');
```

```
Starting
Stopping
0 Second Timer
2 Seconds Timer
```

Why the `0 Second Timer` come after `Stopping`? Let's answer it in the next session.

### 3. Call Stack, Callback Queue, and Event Loop

![async-nodejs](../img/s06/6-1-async-nodejs.png 'async-nodejs')

**Call stack** is a simple **data structure** provided by the V8 JS engine. The job of the call stack is to **track the execution of our program** and it does that by keeping track of **all of the functions that are currently running**.

![async-nodejs](../img/s06/6-2-async-nodejs.png 'async-nodejs')

Let's come back to the previous example...

![async-nodejs](../img/s06/6-3-async-nodejs.png 'async-nodejs')

`SetTimout` 0 sec is done and the `callback` function is ready to get executed but before it can be executed it needs to be added onto the call stack (that's where functions go to run). Now this is where the event loop comes into play. The event loop looks at 2 things: the **call stack** and the **callback queue**. **If the call stack is empty, it's going to run items from the callback queue**. So, at this point the event loop says: "I know you got added to the callback queue but the callstack is not empty so I can't execute you".

### 4. Making HTTP Requests

Go to [weatherstack](https://weatherstack.com/quickstart) and create an account.

Get the **API access key** and test it – `http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=37.8267,-122.4233`.

```json
{
  "request": {
    "type": "LatLon",
    "query": "Lat 37.83 and Lon -122.42",
    "language": "en",
    "unit": "m"
  },
  "location": {
    "name": "Alameda",
    "country": "United States of America",
    "region": "California",
    "lat": "37.765",
    "lon": "-122.241",
    "timezone_id": "America/Los_Angeles",
    "localtime": "2020-09-08 00:30",
    "localtime_epoch": 1599525000,
    "utc_offset": "-7.0"
  },
  "current": {
    "observation_time": "07:30 AM",
    "temperature": 19,
    "weather_code": 116,
    "weather_icons": [
      "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
    ],
    "weather_descriptions": ["Partly cloudy"],
    "wind_speed": 15,
    "wind_degree": 300,
    "wind_dir": "WNW",
    "pressure": 1006,
    "precip": 0,
    "humidity": 73,
    "cloudcover": 50,
    "feelslike": 19,
    "uv_index": 1,
    "visibility": 16,
    "is_day": "no"
  }
}
```

---

Now, we want to make the same request than above bit inside Nodejs. Let's install a npm package (we're going to see how to do it without npm package later). We need to install [`request`](https://www.npmjs.com/package/request) (deprecated) or [`postman-request`](https://www.npmjs.com/package/postman-request).

But first we need to init npm: `npm init -y`. Then we have to install `postman-request`: `npm i postman-request`.

```js
// weather-app/app.js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=37.8267,-122.4233';

request({ url }, (error, response) => {
  const data = JSON.parse(response.body);
  console.log(data);
});
```

```json
{
  "request": {
    "type": "LatLon",
    "query": "Lat 37.83 and Lon -122.42",
    "language": "en",
    "unit": "m"
  },
  "location": {
    "name": "Alameda",
    "country": "United States of America",
    "region": "California",
    "lat": "37.765",
    "lon": "-122.241",
    "timezone_id": "America/Los_Angeles",
    "localtime": "2020-09-08 00:44",
    "localtime_epoch": 1599525840,
    "utc_offset": "-7.0"
  },
  "current": {
    "observation_time": "07:44 AM",
    "temperature": 19,
    "weather_code": 116,
    "weather_icons": [
      "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
    ],
    "weather_descriptions": ["Partly cloudy"],
    "wind_speed": 15,
    "wind_degree": 300,
    "wind_dir": "WNW",
    "pressure": 1006,
    "precip": 0,
    "humidity": 73,
    "cloudcover": 50,
    "feelslike": 19,
    "uv_index": 1,
    "visibility": 16,
    "is_day": "no"
  }
}
```

### 5. Customizing HTTP Requests

We can use `json: true` option to avoid to parse the response.

```js
// weather-app/app.js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=37.8267,-122.4233';

request({ url: url, json: true }, (error, response) => {
  console.log(response.body.current);
});
```

```js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=37.8267,-122.4233&units=m';

request({ url: url, json: true }, (error, response) => {
  const { current } = response.body;
  const { temperature, feelslike } = current;
  console.log(
    `It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out`,
  );
});
```

### 6. An HTTP Request Challenge

```js
// Geocoding
// Address -> Lat/Long -> Weather

const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1Ijoiam9obnNtaXRoNzgiLCJhIjoiY2tldjFsNnk4MGsyajJybWU4bmRnaWRucCJ9.2QsD-tv8oYpxB8_wVsWpcw&limit=1';

request({ url: geocodeURL, json: true }, (error, response) => {
  const { features } = response.body;
  const lat = features[0].center[1];
  const long = features[0].center[0];
  console.log(lat, long);
});
```

### 7. XXX

### 8. XXX

### 9. XXX

### 10. XXX

### 11. XXX

### 12. XXX

### 13. XXX

### 14. XXX

### 15. XXX

### 16. XXX

### 17. XXX