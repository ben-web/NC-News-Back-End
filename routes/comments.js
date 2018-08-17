'use strict';

const
  commentsRouter = require('express').Router(),
  { updateCommentVotes, deleteCommentById } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteCommentById);

module.exports = commentsRouter;
