const { Comment } = require('../models');

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  let vote = 0;

  if (req.query.vote === 'up') vote = 1;
  else if (req.query.vote === 'down') vote = -1;
  else throw { status: 400, message: 'Vote Value Invalid' };

  return Comment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: vote } },
    { new: true }
  )
    .then(comment => {
      if (!comment) throw { status: 404, message: 'Comment Not Found' };
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return Comment.findByIdAndRemove(comment_id)
    .then(comment => {
      if (!comment) throw { status: 404, message: 'Comment Not Found' };
      res.status(200).send({ comment });
    })
    .catch(next);
};
