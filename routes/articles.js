'use strict';

const
  articlesRouter = require('express').Router(),
  { getArticles, getArticleById, getCommentsByArticleId, createComment } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(createComment);

module.exports = articlesRouter;
