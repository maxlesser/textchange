var express = require('express');

//var anyDB = require('any-db');

var engines = require('consolidate');

//var conn = anyDB.createConnection('sqlite3://chatrooms.db');
var app = express();

app.use(express.bodyParser()); // definitely use this feature

//public files like pictures are in public
app.use('/public', express.static(__dirname + '/public'));

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates

//home page response
app.get('/', function(request, response){
	response.render('home.html');
});

app.listen(8080);