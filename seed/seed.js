'use strict';

const
  mongoose = require('mongoose'),
  { Article, Comment, Topic, User } = require('../models'),
  { formatArticleData } = require('./utils');

const seedDB = ({ topicData, userData, articleData }) => {
  return mongoose.connection.dropDatabase()

    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })

    .then(([
      topicDocs,
      userDocs
    ]) => {

      return Promise.all([
        Article.insertMany(formatArticleData(articleData, userDocs)),
        topicDocs,
        userDocs
      ]);
    })

    .then(([
      articleDocs,
      topicDocs,
      userDocs
    ]) => {
      console.log(topicDocs.length, ' topics added to DB');
      console.log('First Topic >>>', topicDocs[0]);
      console.log(userDocs.length, ' users added to DB');
      console.log('First User >>>', userDocs[0]);
      console.log(articleDocs.length, ' articles added to DB');
      console.log('First Article >>>', articleDocs[0]);
    });
};

module.exports = seedDB;