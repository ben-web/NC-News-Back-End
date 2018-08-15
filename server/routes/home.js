'use strict';

const
  homeRouter = require('express').Router(),
  { getHome } = require('../controllers/home');

homeRouter.route('/')
  .get(getHome);

module.exports = homeRouter;
