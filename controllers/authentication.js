const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
  //See if a user with given email exists
  console.log('Coming Sign-up request', req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'E-Mail and Password required.' });
  }

  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return next(err);
    }

    //If a user with email does exist return an error
    if (user) {
      return res.status(422);
    }

    // If a user with email doenst exist, create and save user record
    const newUser = new User({
      email: email,
      password: password
    });

    newUser.save(function(err) {
      if (err) {
        return next(err);
      }

      //respond to request indicating the user was created.
      res.json({ success: true, token: tokenForUser(newUser) });
    });
  });
};

exports.signin = function(req, res, next) {
  res.send({ success: true, token: tokenForUser(req.user) });
};