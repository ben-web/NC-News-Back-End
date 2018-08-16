'use strict';

const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  { dbUrl } = require('./config'),
  bodyParser = require('body-parser'),
  { homeRouter, apiRouter } = require('./routes');

// Setup Mongoose Connection
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${dbUrl}`)
  })
  .catch(err => {
    console.log(`MongoDB connection error: ${err.message}`)
  });

// Parsing
app.use(bodyParser.json());

// Set EJS as View Engine
app.set('view engine', 'ejs');

// Static Files
app.use(express.static('public'));

// Log Requests in Dev
if (process.env.NODE_ENV === 'development') {
  app.all('/*', (req, res, next) => {
    console.log(`${req.method} request was made to: ${req.originalUrl}`);
    return next();
  });
}

// Routes
app.use('/', homeRouter)
app.use('/api', apiRouter);

// 404
app.use('/*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

// Custom Errors
app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    err.status = 400;
    err.message = err.message || err.msg;
  };
  if (err.status) res.status(err.status).send({ message: err.message || err.msg });
  else next(err);
});

// 500
app.use((err, req, res, next) => {
  console.log(err, ' <<< error object');
  console.log(err.code, ' <<< error code');
  res.status(500).send({ error: `Internal Server Error ${err.message || err.msg}` });
});

module.exports = app;