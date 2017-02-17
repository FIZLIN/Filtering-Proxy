const jwt = require("jsonwebtoken"),
      tokenSecret = 'secret',
      bcrypt = require('bcrypt-nodejs');

function getLoggedUserId(token) {
    console.log('');
    console.log("getLoggedUserId");
    // console.log(token);
    if (token) {
        var decoded = jwt.verify(token, tokenSecret);
        if (decoded._id) {
            return decoded._id
        }
    }
}

function getTokenForUser(user) {
    console.log('');
    console.log("getTokenForUser");
    // console.log(user);
    var token = jwt.sign({ _id: user._id }, tokenSecret, {
        expiresIn: '24h'
    });
    return token;
}

function isUserLoggedIn(req, callbackFunc) {
    console.log('');
    console.log("isUserLoggedIn");
    console.log(req.session);
    if (!req.session || !req.session.accessToken) {
        return false;
    }

    var decoded = jwt.verify(req.session.accessToken, tokenSecret);
    console.log(decoded);
    if (decoded) {
        return true;
    }

    return false;
}

function requireAuthentication(req, res, next) {
    console.log('');
    console.log("requireAuthentication");
    // console.log(req, res, next);
    if (isUserLoggedIn(req)) {
        next();
    } else {
        res.redirect('/login');
    }
}

function comparePasswords(plainPassword, hashedPassword) {
    console.log('');
    console.log("comparePasswords");
    // console.log(plainPassword, hashedPassword);
    var areEqual = bcrypt.compareSync(plainPassword, hashedPassword);
    return areEqual;
}

function hashPassword(plainPassword) {
    console.log('');
    console.log("hashPassword");
    // console.log(plainPassword);
    var hashedPassword = bcrypt.hashSync(plainPassword);
    return hashedPassword;
}

function logUser(req, res, user) {
    console.log('');
    console.log("logUser");
    // console.log(req, res, user);
    if (comparePasswords(req.body.password, user.password)) {
        var token = getTokenForUser(user);
        req.session = {};
        req.session.accessToken = token;
        req.session.currentEmail = user.email;
        console.log(req.session)
        res.cookie('token', token)
        return true;
    }

    return false;
}

exports.getLoggedUserId = getLoggedUserId;
exports.getTokenForUser = getTokenForUser;
exports.requireAuthentication = requireAuthentication;
exports.comparePasswords = comparePasswords;
exports.hashPassword = hashPassword;
exports.logUser = logUser;
exports.isUserLoggedIn = isUserLoggedIn;