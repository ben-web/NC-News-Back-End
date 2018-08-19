'use strict';

const
  usersRouter = require('express').Router(),
  { getUserByUsername } = require('../controllers/users');

usersRouter.route('/:username')
  .get(getUserByUsername);

module.exports = usersRouter;
