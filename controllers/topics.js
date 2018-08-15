const { Topic, Article } = require('../models');

exports.getTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.status(200).send({ topics })
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const
    { topic } = req.params
  return Article.find({ belongs_to: topic })
    .then(articles => {
      res.status(200).send({ articles })
    })
    .catch(next);
};

