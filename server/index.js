'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

module.exports = () => {
  let server = express(),
    create,
    start;

  create = (config) => {
    let routes = require('./routes');

    // Server Settings
    // server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);
    server.set('viewDir', config.viewDir);
\
    // Middleware Parser
    server.use(bodyParser.json());

    // Setup View Engine
    
    server.set('views', server.get('viewDir'));
    server.set('view engine', 'ejs');
    
/*     server.engine('.hbs', expressHandlebars({
      defaultLayout: 'default',
      layoutsDir: config.viewDir + '/layouts',
      extname: '.hbs'
    }));

    server.set('views', server.get('viewDir'));
    server.set('view engine', '.hbs'); */

    // Set up routes
    routes.init(server);
  };

  start = () => {
    let hostname = server.get('hostname'),
      port = server.get('port');

    server.listen(port, (err) => {
      if (err) console.log(err);
      else console.log('Express server listening on - http://' + hostname + ':' + port);
    });
  };

  return {
    create: create,
    start: start
  };
};





const apiRouter = require('./routes/api');

const { DB_URL } = require('./config');

