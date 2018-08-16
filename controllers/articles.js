const { Article } = require('../models');

exports.getArticles = (req, res, next) => {
  return Article.find()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return Article.findById(article_id)
    .then(article => {
      if (!article) throw { status: 404, message: 'Article Not Found' };
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  res.status(200).send({ message: 'Not Implemented getCommentsByArticleId' });
};

exports.createComment = (req, res, next) => {
  res.status(200).send({ message: 'Not Implemented createComment' });
};





exports.getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  return Article.find({ belongs_to: topic_slug })
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
  // Check slug exists
  return Topic.findOne({ slug: topic_slug })
    .then(topic => {
      if (!topic) throw { status: 400, message: 'Topic Does Not Exist' };
      // Save New Article
      return newArticle.save();
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};



