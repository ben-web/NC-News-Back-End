const { Topic, Article } = require('../models');

exports.getTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const
    { topic_slug } = req.params
  return Article.find({ belongs_to: topic_slug })
    .then(articles => {
      if (articles.length === 0) throw { status: 404, message: 'No Articles Found for Requested Topic' };
      res.status(200).send({ articles });
    })
    .catch(next);
};

// controller needs to handle where nothing is found as mongoose returns null for valid but non-existent IDs

