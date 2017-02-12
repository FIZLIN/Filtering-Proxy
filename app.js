const  express = require("express"),
	   bodyParser = require("body-parser"),

	   router     = require('./router'),
	   FiltersModel = require('./models/filters'),

	   app = express(),
	   port = 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port, function () {
	console.log('proxy listening on port ' + port);
});