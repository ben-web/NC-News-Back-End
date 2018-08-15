'use strict';

exports.formatArticleData = (articleData, userDocs) => {
  return articleData.map(article => {
    const
      belongs_to = article.topic,
      created_by = userDocs.find(user => user.username === article.created_by)._id;
    return {
      ...article,
      belongs_to,
      created_by
    };
  });
};

exports.formatCommentData = (commentData, articleDocs, userDocs) => {
  return commentData.map(comment => {
    const
      belongs_to = articleDocs.find(article => article.title === comment.belongs_to)._id,
      created_by = userDocs.find(user => user.username === comment.created_by)._id;
    return {
      ...comment,
      belongs_to,
      created_by
    };
  });
};

