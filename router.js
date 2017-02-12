const express      = require('express'),
      request      = require('request'),
      router       = express.Router(),

      FiltersModel = require('./models/filters');

function censure(msg) {
    return new Promise(function(resolve, reject) {
        FiltersModel.find({},'', (err,data) => {
            if (err) reject("Mongo Error");
            msg = msg.split(" ").map((x) => {
                data.map((y) => {
                    if (x.toUpperCase().indexOf(y.value.toUpperCase()) > -1) {
                        if (y.action === "censure") x = Array(x.length + 1).join("*");
                        if (y.action ===  "reject") reject("Message rejected!");
                    }
                });
                return x;
            })

            resolve(msg.join(' '));
        });
    })
}

router.post('/censure', function(req, res) {
    if (!req.body.msg) return res.status(400).send("Missing body!").end();

    censure(req.body.msg)
    .then((censured) => {
        res.status(200).send(censured).end();
        // request({
        // uri: "http://localhost:8000/get",
        // method: "GET"
        // }, function(error, response, body) {
        //     console.log(body);
        // });
    })
    .catch((err) => {
        res.status(400).send(err).end();
    })
});


router.post('/filters/add', function (req, res) {
    let type   = req.body.type,
        value  = req.body.value,
        action = req.body.action,
        
        newFilter = new FiltersModel({ type, value, action });
    
    if (!type || !value || !action) return res.status(400).send("Empty Data!").end();
    
    newFilter.save(function (err) {
        if (err) res.status(400).send("Mongo Error!").end();
        else     res.status(200).send("Filter added!").end();
    });
});
router.post('/filters/remove', function (req, res) {
    let type   = req.body.type,
        value  = req.body.value,
        action = req.body.action;
    
    FiltersModel.findOneAndRemove({ type, value, action },'',(err,data) => {
        if (err || !data) return res.status(404).send("Filter not found!").end();
        else              return res.status(200).send("Filter removed!").end();
    });
})
router.get('/filters/get', function (req, res) {
    FiltersModel.find({},'', (err,data) => {
        if (err) res.status(401).send("Unauthorized").end();
        else     res.status(200).send(data).end();
    });
});

module.exports = router;