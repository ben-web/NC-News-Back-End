'use strict';

const
  DB_URL = require('../config'),
  data = require('./data'),
  seedDB = require('./seed'),
  mongoose = require('mongoose');
  console.log(DB_URL)


mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}`)
    return seedDB(data);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Disconnected from ${DB_URL}`);
  })
  .catch(console.log);
