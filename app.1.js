const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api.js');

// Static Files
app.use(express.static('public'));

// Parsing
app.use(bodyParser.json());

// Set EJS as View Engine
app.set('view engine', 'ejs');

// Route Root
app.get('/', (req, res) => {
  res.render('index');
});

// Route API
app.use('/api', apiRouter);

// 404
app.use('/*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

// Custom Errors
app.use((error, req, res, next) => {
  if (error.code) {
    res.status(error.code).send({ error });
  }
  else next(error);
});

// 500
app.use((err, req, res, next) => {
  console.log(err, ' <<< error object');
  console.log(err.code, ' <<< error code');
  res.status(500).send({ error: `Internal Server Error ${err.message}` });
});

module.exports = app;