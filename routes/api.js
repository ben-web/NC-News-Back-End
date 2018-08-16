'use strict';

const
  apiRouter = require('express').Router(),
  articlesRouter = require('./articles'),
  topicsRouter = require('./topics'),
  { getApiIndex } = require('../controllers/api');


apiRouter.route('/')
  .get(getApiIndex);

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
