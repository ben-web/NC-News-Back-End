'use strict';

const
  cors = require('cors'),
  apiRouter = require('express').Router(),
  articlesRouter = require('./articles'),
  commentsRouter = require('./comments'),
  topicsRouter = require('./topics'),
  usersRouter = require('./users'),
  { getApiIndex } = require('../controllers/api');


apiRouter.route('/')
  .get(getApiIndex);

apiRouter.use(cors());
apiRouter.options('*', cors());

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
