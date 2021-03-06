'use strict';

const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  DB_URL = process.env.DB_URL || require('./config'),
  bodyParser = require('body-parser'),
  apiRouter = require('./routes/api');

// Setup Mongoose Connection
mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}`)
  })
  .catch(err => {
    console.log(`MongoDB connection error: ${err.message}`)
  });

// Parsing
app.use(bodyParser.json());

// Set EJS as View Engine
app.set('view engine', 'ejs');

// Log Requests in Dev
if (process.env.NODE_ENV === 'development') {
  app.all('/*', (req, res, next) => {
    console.log(`${req.method} request was made to: ${req.originalUrl}`);
    return next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/api');
});
app.use('/api', apiRouter);

// 404
app.use('/*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

// Custom Errors
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    err.status = 400;
    err.message = 'Provided ID was Invalid';
  };
  if (err.name === 'ValidationError') {
    err.status = 400;
    err.message = err.message;
  };
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
});

// 500
app.use((err, req, res) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(err, ' <<< error object');
    console.log(err.code, ' <<< error code');
  }
  res.status(500).send({ error: `Internal Server Error ${err.message || err.msg}` });
});

module.exports = app;