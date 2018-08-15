'use strict';

const
  mongoose = require('mongoose'),
  { Article, Comment, Topic, User } = require('../models'),
  { formatArticleData, formatCommentData } = require('./utils');

const seedDB = ({ topicData, userData, articleData, commentData }) => {
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
        Comment.insertMany(formatCommentData(commentData, articleDocs, userDocs)),
        articleDocs,
        topicDocs,
        userDocs
      ]);
    })
    // Log Outcomes
    .then(([
      commentDocs,
      articleDocs,
      topicDocs,
      userDocs
    ]) => {
      console.log(topicDocs.length, ' topics added to DB');
      console.log('<<< First Topic >>>\n', topicDocs[0]);
      console.log(userDocs.length, ' users added to DB');
      console.log('<<< First User >>>\n', userDocs[0]);
      console.log(articleDocs.length, ' articles added to DB');
      console.log('<<< First Article >>>\n', articleDocs[0]);
      console.log(commentDocs.length, ' comments added to DB');
      console.log('<<< First Comment >>>\n', commentDocs[0]);
    });
};

module.exports = seedDB;