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
     UsersModel.findOne({ 'email': req.body.email }, function(err, user) {
        if (user) {
            if (auth.logUser(req, res, user)) {
                console.log(req.session);
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

view.get('/register', function(req, res) {
    res.render('pages/register');
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

view.get('/filters', auth.requireAuthentication, function(req, res) {
    console.log('');
    console.log(req.session);
    FiltersModel.find({},'', (err,data) => {
        if (err) console.log("error occured: ", e)
        else {
            res.render('pages/filters',{
                "objectslist": data
            });
        } 
    });
});

view.get('/logout', auth.requireAuthentication, function(req, res) {
    req.session = null;
    res.redirect("/login");
});

view.post('/add', function(req, res) {
    let value  = req.body.value,
        action = req.body.action,
        
        newFilter = new FiltersModel({ value, action });
    
    if (!value || !action) {
        console.log("Missing Data!")
        return;
    }
    
    newFilter.save(function (err) {
        if (err) console.log("error occured: ", err)
        else {
            res.redirect("/filters");
        }
    });
})

view.post('/remove', function(req, res) {
    let value  = req.body.value,
        action = req.body.action;

    console.log(value, action);

    if (!value || !action) {
        console.log("Missing Data!")
        return;
    }
    
    FiltersModel.findOneAndRemove({ value, action },'',(err,data) => {
        if (err) console.log("error occured: ", err)
        else {
            res.redirect("/filters");
        }
    });
})

module.exports = view;