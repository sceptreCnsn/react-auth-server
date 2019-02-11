const User = require('../models/user');

exports.signup = function (req, res, next) {
    //See if a user with given email exists
    console.log('Coming Sign-up request', req.body);
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }, function (err, user) {
        if (err) { return next(err) };

        //If a user with email does exist return an error
        if (user) { return res.status(422); }

        // If a user with email doenst exist, create and save user record
        const newUser = new User({
            email: email,
            password: password
        });

        newUser.save(function(err){
            if(err) {return next(err);}

            res.json({success: true});
        });
    });

    //respond to request indicating the user was created.
}