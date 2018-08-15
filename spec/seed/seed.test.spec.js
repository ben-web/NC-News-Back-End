'use strict';

process.env.NODE_ENV = 'test';

const 
  { expect } = require('chai'),
  seedTest = require('../seed/seed.test.js'),
  request = require('supertest')(seedTest);

