var express = require('express');

var anyDB = require('any-db');

var engines = require('consolidate');

//passport setup
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


var users = [
    { id: 1, username: 'max', password: 'lesser', email: 'max@example.com' }
  , { id: 2, username: 'andy', password: 'chen', email: 'andy@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message.  Otherwise, return the
    // authenticated `user`.
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  }
));



var conn = anyDB.createConnection('sqlite3://books.db');
var app = express();

app.configure(function() {
  app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
  app.set('views', __dirname + '/templates'); // tell Express where to find templates
  app.use(express.cookieParser());
  app.use(express.bodyParser()); // definitely use this feature
  app.use(passport.initialize());
  app.use(passport.session());

  //public files like pictures are in public
  app.use('/public', express.static(__dirname + '/public'));
});



//home page response
app.get('/', function(request, response){
	response.render('home.html');
});

//home page response
app.get('/login', function(request, response){
	response.render('login.html');
});

//login page
app.post('/login',
  passport.authenticate('local', 
  	{ successRedirect: '/', failureRedirect: '/login' }));

//search json response
app.get('/search/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
	var sql = 'SELECT * FROM books WHERE title LIKE $1 OR author LIKE $1 OR class LIKE $1 ORDER BY time DESC';
	conn.query(sql, query, function(error, result){
    console.log(result);
		response.json(result);
	});
});

app.listen(8080);