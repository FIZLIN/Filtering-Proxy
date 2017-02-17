const  express = require("express"),
	   bodyParser = require("body-parser"),

	   router     = require('./router'),
	   view	     = require('./view'),
	   
	   app = express(),
	   port = 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/api', router);
app.use('/', view);

app.listen(port, function () {
	console.log('proxy listening on port ' + port);
});