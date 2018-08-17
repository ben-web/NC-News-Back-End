'use strict';

const
  usersRouter = require('express').Router(),
  { deleteUserByUsername } = require('../controllers/users');

usersRouter.route('/:username')
  .delete(deleteUserByUsername);

module.exports = usersRouter;
