const http = require('http');

const url = `http://api.weatherstack.com/current?access_key=a843dc3f67d5acc6c56c5a236fa7f31c&query=45,-75&units=m`;

const req = http.request(url, (response) => {
  let data = '';
  response.on('data', (chunk) => {
    data = data + chunk.toString();
  });
  response.on('end', () => {
    const body = JSON.parse(data);
    console.log(body);
  });
});

req.on('error', (error) => {
  console.log('An error: ', error);
});

req.end();
