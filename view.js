const express      = require('express'),
      request      = require('request'),

      UsersModel   = require('./models/collections/users'),
      FiltersModel = require('./models/collections/filters'),

      view         = express.Router(),
      router       = require('./router'),
      auth         = require('./auth');


// GET

view.get('/', function(req, res) {
    if (auth.checkLogin(req)) {
        res.redirect("/filters");
    } else {
        res.redirect("/login");
    }
})

view.get('/login', function(req, res) {
    if (auth.checkLogin(req)) {
        res.redirect("/filters");
    } else {
        res.render('pages/login');
    }
});

view.get('/register', function(req, res) {
    res.render('pages/register');
});

view.get('/filters', auth.requireAuthentication, function(req, res) {
    FiltersModel.find({},'', (err,data) => {
        if (err) res.send("error occured: ", e)
        else {
            res.render('pages/filters',{
                "objectslist": data
            });
        } 
    });
});

view.get('/logout', auth.requireAuthentication, function(req, res) {
    res.clearCookie('token');
    res.redirect("/login");
});

// POST

view.post('/login', function(req, res) {
     UsersModel.findOne({ 'email': req.body.email }, function(err, user) {
        if (user) {
            if (auth.login(req, res, user)) {
                res.redirect("/filters");
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

view.post('/register', function(req, res) {
    let email = req.body.email,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) {
        res.send("Password and confirm password are not equal!");
        return;
    }

    let hashedPasword = auth.hashPassword(password);

    new UsersModel({email: email, password: hashedPasword})
    .save(function(err, doc) {
        if (err) {
            res.send("There was a problem registering the user.");
        } else {
            res.redirect("/login");
        }
    });
});

view.post('/add', function(req, res) {
    let value  = req.body.value,
        action = req.body.action,
        
        newFilter = new FiltersModel({ value, action });
    
    if (!value || !action) {
        res.send("Missing Required Data!")
        return;
    }
    
    newFilter.save(function (err) {
        if (err) res.send("error occured: ", err)
        else {
            res.redirect("/filters");
        }
    });
})

view.post('/remove', function(req, res) {
    let value  = req.body.value,
        action = req.body.action;
    
    FiltersModel.findOneAndRemove({ value, action },'',(err,data) => {
        if (err) res.send("error occured: ", err)
        else {
            res.redirect("/filters");
        }
    });
})

module.exports = view;