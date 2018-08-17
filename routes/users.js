'use strict';

const
  usersRouter = require('express').Router(),
  { getUserByUsername } = require('../controllers/users');

usersRouter.route('/:username')
  .delete(getUserByUsername);

module.exports = usersRouter;
