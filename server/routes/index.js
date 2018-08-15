'use strict';

const
  apiRouter = require('./api'),
  homeRouter = require('./home'),
  mongoose = require('mongoose'),
  { dbUrl } = require('../../config');

const init = (server) => {

  // Connect to DB
  mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
      console.log(`Connected to ${dbUrl}`)
    });

  server.get('*', (req, res, next) => {
    console.log('Request was made to: ' + req.originalUrl);
    return next();
  });


  server.use('/', homeRouter)
  server.use('/api', apiRouter);
}

module.exports = {
  init: init
};