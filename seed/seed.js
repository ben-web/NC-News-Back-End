'use strict';

const
  mongoose = require('mongoose'),
  { Article, Comment, Topic, User } = require('../models'),
  { formatArticleData, formatCommentData } = require('../utils/factory-helpers');

const seedDB = ({
  articleData,
  commentData,
  topicData,
  userData
}) => {
  return mongoose.connection.dropDatabase()
    // Insert Topics and Users
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    // Insert Articles
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
    // Insert Comments
    .then(([
      articleDocs,
      topicDocs,
      userDocs
    ]) => {
      return Promise.all([
        articleDocs,
        Comment.insertMany(formatCommentData(commentData, articleDocs, userDocs)),
        topicDocs,
        userDocs
      ]);
    })
    .then(([
      articleDocs,
      commentDocs,
      topicDocs,
      userDocs
    ]) => {

      // Log Results of Seed when not in Test
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Added to DB: ${articleDocs.length} Articles | ${commentDocs.length} Comments | ${topicDocs.length} Topics | ${userDocs.length} Users`);
      }

      // Return Promise.all so may access collections in tests
      return Promise.all([
        articleDocs,
        commentDocs,
        topicDocs,
        userDocs
      ]);
    });
};

module.exports = seedDB;