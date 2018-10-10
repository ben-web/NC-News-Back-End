'use strict';

const
  articlesRouter = require('express').Router(),
  {
    getArticles,
    getArticleById,
    getCommentsByArticleId,
    createComment,
    updateArticleVotes
  } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(createComment);

module.exports = articlesRouter;
