'use strict';

const
  apiRouter = require('express').Router(),
  { getApiIndex } = require('../controllers/api'),
  topicsRouter = require('./topics');

apiRouter.route('/')
  .get(getApiIndex);

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
