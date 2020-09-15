# Accessing API from Browser (Weather App)

### 1. Introduction

We're going to learn how to create API endpoints and how to access them from the browser. Link our backend and our frontend app.

### 2. The Query String

Let's send a GET request with query parameters `http://localhost:3000/products?search=games&rating=5`.

Here is an example of we can get the query params via the `req` object.

```js
// web-server/src/app.js
//...
app.get('/products', (req, res) => {
  const { search, rating } = req.query;
  console.log('search: ', search);
  console.log('rating: ', rating);

  if (!search) {
    // We need to use return here otherwise we res.send twice which throw an error!
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    return res.send({
      error: 'You must provide a search term',
    });
  }

  res.send({
    product: [{}],
  });
});
//...
```

Let's try it with our `weather` endpoint – `http://localhost:3000/weather?address=brussels`.

```js
// web-server/src/app.js
//...
app.get('/weather', (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  res.send({
    location: 'Brussels-Capital, Belgium',
    forecast:
      'Partly cloudy in Eisingen (Belgium). It is currently 13 degrees out. It feels like 13 degrees out',
    address,
  });
});
//...
```

### 3. Building a JSON HTTP Endpoint

Time to link our work done with the **weather-app** and our **web server**.

```js
// web-server/src/app.js
//...
app.get('/weather', (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  geocode(address, (error, { lat, long, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(long, lat, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        location,
        forecast: forecastData,
        address,
      });
    });
  });
});
//...
```

### 4. ES6 Aside: Default Function Paramaters

```js
// playground/7-default-params.js
const greeter = (name) => {
  console.log(`Hello ${name}`);
};

greeter('Max'); // Hello Max
greeter(); // Hello undefined

const greeterImproved = (name = 'User', age) => {
  console.log(`Hello ${name}`);
};

greeterImproved(); // Hello user

// ---

// Object destructuring (and default params)

const product = {
  label: 'Red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

// const transaction = (type, { label, stock }) => {
//   console.log(type, label, stock);
// };

// transaction('order'); // TypeError: Cannot destructure property 'label' of 'undefined' as it is undefined.

const transactionImproved = (type, { label, stock = 0 } = {}) => {
  console.log(type, label, stock);
};

transactionImproved('order'); // order undefined 0
```

### 5. Browser HTTP Requests with Fetch

We explore the **fetch API** available only in the client side. Fetch allows us to fetch data from an url from the browser.

```js
// web-server/public/js/app.js
console.log('Client side JS file is loaded!');

fetch('http://localhost:3000/weather?address=boston').then((response) => {
  response.json().then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      const { location, forecast } = data;
      console.log(location);
      console.log(forecast);
    }
  });
});
```

### 6. Creating a Search Form

```hbs
<!-- web-server/templates/views/index.hbs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/img/weather.png" type="image/x-icon" />
    <link rel="stylesheet" href="/css/styles.css" />

    <title>Weather</title>
  </head>

  <body>
    <div class="main-content">
      {{>header}}
      <p>Use this site to get your weather!</p>
      <form>
        <input type="text" placeholder="Location" />
        <button type="submit">Search</button>
      </form>
    </div>

    {{>footer}}
    <!-- script as to be placed here otherwise we got an error (the html dom is not loaded yet) -->
    <script src="/js/app.js"></script>
  </body>
</html>
```

```js
// web-server/public/js/app.js
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = search.value;

  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          const { location, forecast } = data;
          console.log(location);
          console.log(forecast);
        }
      });
    },
  );
});
```

### 7. Wiring up the User Interface
