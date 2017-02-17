const jwt = require("jsonwebtoken"),
      tokenSecret = 'secret',
      bcrypt = require('bcrypt-nodejs');

function getToken(user) {
    var token = jwt.sign({ _id: user._id }, tokenSecret, {
        expiresIn: '24h'
    });
    return token;
}

function checkLogin(req, callbackFunc) {
    if (!req.cookies.token) return;
    var decoded = jwt.verify(req.cookies.token, tokenSecret);
    if (decoded) {
        return true;
    }

    return false;
}

function requireAuthentication(req, res, next) {
    if (checkLogin(req)) {
        next();
    } else {
        res.redirect('/login');
    }
}

function hashPassword(plainPassword) {
    var hashedPassword = bcrypt.hashSync(plainPassword);
    return hashedPassword;
}

function login(req, res, user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
        res.cookie('token', getToken(user));
        res.cookie('userEmail', user.email);
        return true;
    }
    return false;
}

exports.requireAuthentication = requireAuthentication;
exports.hashPassword = hashPassword;
exports.login = login;
exports.checkLogin = checkLogin;