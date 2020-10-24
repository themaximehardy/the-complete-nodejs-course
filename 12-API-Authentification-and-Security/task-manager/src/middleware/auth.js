const jsonwebtoken = require('jsonwebtoken');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // 1 – we get the token in the header request
    const token = req.header('Authorization').replace('Bearer ', '');
    // 2 – we verify it and we decode it
    const decode = jwt.verify(token, 'OUR_SECRET');
    // 3 – we find the user based on the decoded _id and we check if the token exists inside of this user
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate!' });
  }
};

module.exports = auth;
