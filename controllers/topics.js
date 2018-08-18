const { Article, Topic } = require('../models');

exports.getTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  return Article.find({ belongs_to: topic_slug })
    // Populate created_by with User
    .populate('created_by')
    .exec()
    .then(articles => {
      if (articles.length === 0) throw { status: 404, message: 'No Articles Found for Requested Topic' };
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.createArticle = (req, res, next) => {
  const
    { topic_slug } = req.params,
    newArticle = new Article(req.body);
  newArticle.belongs_to = topic_slug;
  // Check topic_slug exists
  return Topic.findOne({ slug: topic_slug })
    .then(topic => {
      if (!topic) throw { status: 400, message: 'Topic Does Not Exist' };
      // Save new Article
      return newArticle.save();
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
