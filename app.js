const  express = require("express"),
	   bodyParser = require("body-parser"),
	   cookieParser = require('cookie-parser'),

	   router     = require('./router'),
	   view	     = require('./view'),

	   app = express(),
	   port = 8888;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/api', router);
app.use('/', view);

app.listen(port, function () {
	console.log('proxy listening on port ' + port);
});