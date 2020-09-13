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

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Page',
    name: 'Max',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    name: 'Max',
    helpText: 'This is some useful text',
  });
});

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
