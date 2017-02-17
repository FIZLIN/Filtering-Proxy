const express      = require('express'),
      request      = require('request'),
      router       = express.Router();

router.get('/login', function(req, res) {
    if (false) {
        res.redirect("/products");
    } else {
        res.render('pages/login');
    }
});

module.exports = router;