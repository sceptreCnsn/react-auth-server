const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
//define model
const userSchema = new Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    required: true,
    type: String
  }
});

//On save hook encrypt password
//Before saving a model run this function
userSchema.pre('save', function(next) {
  //get access to the user model
  const user = this;

  //generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      //overwrite plaint text pw with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePw, callback) {
  bcrypt.compare(candidatePw, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

//create the model class
const ModelClass = mongoose.model('user', userSchema);

//export the model
module.exports = ModelClass;
