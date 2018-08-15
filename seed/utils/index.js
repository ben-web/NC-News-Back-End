'use strict';
const
  _ = require('lodash');

exports.formatArticleData = (articleData, userDocs) => {
  return articleData.map(article => {
    const
      belongs_to = article.topic,
      created_by = _.find(userDocs, (user) => user.username === article.created_by)._id;
    return {
      ...article,
      belongs_to,
      created_by
    };
  });
};