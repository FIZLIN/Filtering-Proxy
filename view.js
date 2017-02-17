const express      = require('express'),
      request      = require('request'),

      UsersModel     = require('./models/collections/users'),

      router       = express.Router(),
      auth         = require('./auth')

router.get('/login', function(req, res) {
    if (false) {
        res.redirect("/products");
    } else {
        res.render('pages/login');
    }
});

router.post('/login', function(req, res) {
     User.findOne({ 'email': req.body.email }, function(err, user) {
        if (user) {
            if (authenticationHelper.logUser(req, res, user)) {
                res.redirect("/products");
            } else {
                res.send("Invalid password!");
                return;
            }
        } else {
            res.send("No such user found!");
            return;
        }
    });
});

router.get('/register', function(req, res) {
    res.render('pages/register');
});

router.post('/register', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
        res.send("Password and confirm password are not equal!");
        return;
    }

    var hashedPasword = auth.hashPassword(password);
    // Submit to the DB
    new UsersModel({
        "email": req.body.email,
        "password": hashedPasword,
    }).save(function(err, doc) {
        if (err) {
            res.send("There was a problem registering the user.");
        } else {
            res.redirect("/login");
        }
    });
});

module.exports = router;