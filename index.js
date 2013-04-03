var express = require('express');

//var anyDB = require('any-db');

var engines = require('consolidate');

//passport setup
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

//var conn = anyDB.createConnection('sqlite3://chatrooms.db');
var app = express();

app.use(express.bodyParser()); // definitely use this feature
app.use(passport.initialize());
// app.use(passport.session());

//public files like pictures are in public
app.use('/public', express.static(__dirname + '/public'));

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates



passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


//home page response
app.get('/', function(request, response){
	response.render('home.html');
});

//login page
app.post('/login',
  passport.authenticate('local', 
  	{ successRedirect: '/', failureRedirect: '/login' }));

app.listen(8080);