'use strict';
process.env.NODE_ENV = 'test';

// this file is probably unecessary!

const
  { dbUrl, dataDir } = require('../config'),
  seedDB = require('./seed'),
  mongoose = require('mongoose'),
  data = require(dataDir);

mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${dbUrl}`)
    return seedDB(data);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Disconnected from ${dbUrl}`);
  })
  .catch(console.log);
