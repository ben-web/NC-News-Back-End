const { Article, Comment, User } = require('../models');

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
  const { article_id } = req.params;
  // Check article_id exists
  return Article.findById(article_id)
    .then(article => {
      if (!article) throw { status: 400, message: 'Article Does Not Exist' };
      // Get comments for article
      return Comment.find({ belongs_to: article_id })
    })
    .then(comments => {
      if (comments.length === 0) throw { status: 404, message: 'No Comments Found for Article' };
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.createComment = (req, res, next) => {
  const
    { article_id } = req.params,
    newComment = new Comment(req.body);
  newComment.belongs_to = article_id;
  // Check article_id exists
  return Article.findById(article_id)
    .then(article => {
      if (!article) throw { status: 400, message: 'Article Does Not Exist' };
      // Check user_id exists
      return User.findById(newComment.created_by)
    })
    .then(user => {
      if (!user) throw { status: 400, message: 'User Does Not Exist' };
      // Save New Comment
      return newComment.save()
    })
    .then(comment => {
      // Populate belongs_to and created_by with article and user objects
      return comment.populate('belongs_to created_by').execPopulate();
    })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  let vote = 0;

  if (req.query.vote === 'up') vote = 1;
  else if (req.query.vote === 'down') vote = -1;
  else throw { status: 400, message: 'Vote Value Invalid' };

  return Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: vote } },
    { new: true }
  )
    .then(article => {
      if (!article) throw { status: 404, message: 'Article Not Found' };
      res.status(200).send({ article });
    })
    .catch(next);
};
