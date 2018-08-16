'use strict';

const
  topicsRouter = require('express').Router(),
  { getTopics, getArticlesByTopic, createArticle } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics);

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(createArticle);

module.exports = topicsRouter;
