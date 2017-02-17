const express      = require('express'),
      request      = require('request'),

      UsersModel   = require('./models/collections/users'),
      FiltersModel = require('./models/collections/filters'),

      view         = express.Router(),
      router       = require('./router'),
      auth         = require('./auth');

view.get('/login', function(req, res) {
    if (false) {
        res.redirect("/products");
    } else {
        res.render('pages/login');
    }
});

view.post('/login', function(req, res) {
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

view.get('/register', function(req, res) {
    res.render('pages/register');
});

view.post('/register', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
        res.send("Password and confirm password are not equal!");
        return;
    }

    var email = req.body.email,
        password = req.body.password,
        hashedPasword = auth.hashPassword(password);

    new UsersModel({email: email, password: hashedPasword})
    .save(function(err, doc) {
        if (err) {
            res.send("There was a problem registering the user.");
        } else {
            res.redirect("/login");
        }
    });
});

view.get('/filters', auth.requireAuthentication, function(req, res) {
    auth.requireAuthentication();
    FiltersModel.find({},'', (err,data) => {
        if (err) console.log("error occured: ", e)
        else {
            console.log(data);
            res.render('pages/filters',{
                "objectslist": data
            });
        } 
    });
});


module.exports = view;