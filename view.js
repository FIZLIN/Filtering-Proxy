const express      = require('express'),
      request      = require('request'),

      UsersModel     = require('./models/collections/users'),

      router       = express.Router();

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

module.exports = router;