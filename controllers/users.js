const { User } = require('../models');

exports.deleteUserByUsername = (req, res, next) => {
  const { username } = req.params;
    return User.findOneAndDelete({ username: username })
    .then(user => {
      if (!user) throw { status: 404, message: 'User Not Found' };
      res.status(200).send({ user });
    })
    .catch(next);
};
