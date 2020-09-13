# Web Servers (Weather App)

### 1. Introduction

Everything we've created so far has only been accessible via the command line. Let's move to the browser to interact with our app. We're going to learn [Express](https://www.npmjs.com/package/express) – web server with Nodejs.

### 2. Hello Express!

```sh
# initialise npm
npm init -y
# install express
npm install express --save
# create a /src forlder
mkdir src && cd src
# create a new file app.js
touch app.js
```

Here is a **minimal express file** to run a server on the port `3000`.

```js
// web-server/src/app.js
const express = require('express');

const app = express();

app.get('', (req, res) => {
  res.send('Hello Express!');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
```

Then, we need to install `nodemon`, `npm install --save-dev nodemon` and change the package.json file.

```json
{
  "...": "...",
  "scripts": {
    "start": "node ./src/app.js",
    "dev": "nodemon ./src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "...": "..."
}
```

### 3. Serving up HTML and JSON

We can also `send` html and json data.

```js
// web-server/src/app.js
//...
app.get('/about', (req, res) => {
  res.send('<h1>About</h1>');
});

app.get('/weather', (req, res) => {
  res.send({
    location: 'Jette, Brussels-Capital, Belgium',
    forecast:
      'Partly cloudy in Eisingen (Belgium). It is currently 13 degrees out. It feels like 13 degrees out',
  });
});
//...
```

### 4. Serving up Static Assets

It could be very quickly not practical to send html as string. Let's create a `public` folder (for all our static files). And let's add a new file `index.html`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>From a static file</h1>
  </body>
</html>
```

```js
// web-server/src/app.js
const path = require('path');
//...
console.log(__dirname);
// /Users/maximehardy/projects/the-complete-nodejs-course/07-Web-Server/web-server/src
console.log(__filename);
// /Users/maximehardy/projects/the-complete-nodejs-course/07-Web-Server/web-server/src/app.js

console.log(path.join(__dirname, '../'));
// /Users/maximehardy/projects/the-complete-nodejs-course/07-Web-Server/web-server/
//...
```

Let's use the [`path`](https://nodejs.org/docs/latest-v12.x/api/path.html) Nodejs core module.

```js
// web-server/src/app.js
const path = require('path');
const express = require('express');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// index.html, help.html, about.html

app.get('/weather', (req, res) => {
  res.send({
    location: 'Jette, Brussels-Capital, Belgium',
    forecast:
      'Partly cloudy in Eisingen (Belgium). It is currently 13 degrees out. It feels like 13 degrees out',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
```

Go to [`http://localhost:3000/index.html`](http://localhost:3000/index.html), [`http://localhost:3000/help.html`](http://localhost:3000/help.html) and [`http://localhost:3000/about.html`](http://localhost:3000/about.html).

Note: `http://localhost:3000/about` won't work, we need to specify the `.html` at the end.

### 5. Serving up CSS, JS, Images and More

Let's create some static files...

- CSS file `web-server/public/css/styles.css`.

```css
h1 {
  color: grey;
}

img {
  width: 250px;
}
```

- JS file `web-server/public/js/app.js`.

```js
console.log('Client side JS file is loaded!');
```

- An image `web-server/public/img/robot.png`.

Now, we can call these files directly in our html files. For example, here is the `about.html` file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- css -->
    <link rel="stylesheet" href="/css/styles.css" />
    <!-- js -->
    <script src="/js/app.js"></script>
    <title>About page</title>
  </head>
  <body>
    <h1>About</h1>
    <!-- image -->
    <img src="/img/robot.png" alt="robot" />
  </body>
</html>
```

### 6. Dynamic Pages with Templating

This line `app.use(express.static(publicDirectoryPath));` allow us to render **static webpage** via our webserver. But we need to use **a template engine** to render **dynamic web pages** using Express.

We're going to use [Handlebars](https://handlebarsjs.com/) which will allow us 2 things:

- to **render dynamic documents** as opposed to static ones.
- to create **code** that **we can reuse across all the pages**.

Let's intall [`hbs`](https://www.npmjs.com/package/hbs) which is an **Express.js** view engine for **handlebars.js**.

```sh
# install hbs
npm i hbs
```

Once we've installed `hbs`. Now we need to tell Express which templating engine we want to use.

```js
//...
const app = express();
app.set('view engine', 'hbs');
//...
```

Now, we need to create a `index.hbs` (a copy of the `index.html`) file inside of a new folder `web-server/views`.

```hbs
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/css/styles.css" />
  <script src="/js/app.js"></script>
  <title>Document</title>
</head>

<body>
  <h1>{{title}}</h1>
  <p>Created by {{name}}</p>
</body>

</html>
```

```js
//...
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Max',
  });
});
//...
```

```js
// web-server/src/app.js
const path = require('path');
const express = require('express');

const app = express();
app.set('view engine', 'hbs');

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Max',
  });
});

app.get('/weather', (req, res) => {
  res.send({
    location: 'Jette, Brussels-Capital, Belgium',
    forecast:
      'Partly cloudy in Eisingen (Belgium). It is currently 13 degrees out. It feels like 13 degrees out',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
```

### 7. Customizing the Views Directory

Let's take a quick moment to talk about how **we can customize how handlebars is set up**.

`views` folder is a default location Express expect to get the hbs views.

We could change it...

```js
// web-server/src/app.js
//...
const app = express();

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates');
const publicDirectoryPath = path.join(__dirname, '../public');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Max',
  });
});
//...
```

### 8. Advanced Templating

We are going to introduce **partials** here. It is parts of the web page that you're going to reuse across multiple pages in your site. Firstly, we need to setup the `partialsPath` to hbs via `hbs.registerPartials(partialsPath);`.

```js
// web-server/src/app.js
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Max',
  });
});
//...
```

Here is our first partial, located in `web-server/templates/partials/header.hbs`.

```hbs
<h1>Static header.hbs text</h1>
```

Then, we can call it in our templates/views:

```hbs
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/css/styles.css" />
  <script src="/js/app.js"></script>
  <title>Help page</title>
</head>

<body>
  <!-- we call our partial as below -->
  {{>header}}
  <h1>{{title}}</h1>
  <p>{{helpText}}</p>
</body>

</html>
```

Note: we can tweak `nodemon` to restart with specific files. In `package.json`:

```json
{
  "...": "...",
  "nodemonConfig": {
    "watch": ["src", "templates"],
    "ext": "js, hbs"
  },
  "...": "..."
}
```

### 9. 404 Pages

```js
// web-server/src/app.js
//...
app.get('/weather', (req, res) => {
  res.send({
    location: 'Jette, Brussels-Capital, Belgium',
    forecast:
      'Partly cloudy in Eisingen (Belgium). It is currently 13 degrees out. It feels like 13 degrees out',
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Max',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Max',
    errorMessage: 'Page not found',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
```
