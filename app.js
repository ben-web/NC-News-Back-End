'use strict';

const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  { homeRouter, apiRouter } = require('./routes');


// Temp Connect to DB
const
  mongoose = require('mongoose'),
  { dbUrl } = require('./config');

mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${dbUrl}`)
  });


// Parsing
app.use(bodyParser.json());

// Set EJS as View Engine
app.set('view engine', 'ejs');

// Static Files
app.use(express.static('public'));

// Log Requests
app.all('*', (req, res, next) => {
  console.log(`${req.method} request was made to: ${req.originalUrl}`);
  return next();
});

// Routes
app.use('/', homeRouter)
app.use('/api', apiRouter);

// 404
app.use('/*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

// Custom Errors
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
})

// 500
app.use((err, req, res, next) => {
  console.log(err, ' <<< error object');
  console.log(err.code, ' <<< error code');
  res.status(500).send({ error: `Internal Server Error ${err.message}` });
});

module.exports = app;