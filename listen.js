'use strict';

const
  app = require('./app'),
  { HOSTNAME = 'localhost', PORT = 3000 } = process.env;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log('Express server listening on - http://' + HOSTNAME + ':' + PORT);
});