'use strict';

const
  apiRouter = require('express').Router(),
  topicsRouter = require('./topics');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
