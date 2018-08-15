'use strict';

const
  app = require('./app'),
  config = require('./config');

app.listen(config.port, (err) => {
  if (err) console.log(err);
  else console.log('Express server listening on - http://' + config.hostname + ':' + config.port);
});