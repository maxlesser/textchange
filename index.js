var express = require('express');

var anyDB = require('any-db');

var engines = require('consolidate');

var fs = require('fs');

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
  app.use(express.bodyParser({keepExtensions: true})); // definitely use this feature
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

app.get('/search/recent.json', function(request,response) {
    var sql = "SELECT * FROM books WHERE sold=0 ORDER BY time DESC LIMIT 100";

    conn.query(sql, function (error, result) {
        console.log(result);
        response.json(result);
    });
});


//search json response, can also use for autocomplete
app.get('/search/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
	var sql = 'SELECT * FROM books WHERE title LIKE $1 OR author LIKE $1 OR class LIKE $1 AND sold=0 ORDER BY time DESC';
	conn.query(sql, query, function(error, result){
    console.log(result);
		response.json(result);
	});
});

//search json response, can also use for autocomplete
app.get('/searchtitle/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE title LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    console.log(result);
    response.json(result);
  });
});//search json response, can also use for autocomplete
app.get('/searchauthor/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE author LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    console.log(result);
    response.json(result);
  });
});//search json response, can also use for autocomplete
app.get('/searchclass/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE class LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    console.log(result);
    response.json(result);
  });
});


//search json response
app.get('/users.json', function(request,response) {

  var sql = 'SELECT * FROM users';
  conn.query(sql, function(error, result){
    console.log(result);
    response.json(result);
  });
});

//search json response
app.get('/user_posts/:username/book_posts.json', function(request,response) {

  var username = request.params.username;
  console.log(username);
  var sql = 'SELECT * FROM books WHERE seller = $1 ORDER BY sold, time DESC';
  conn.query(sql, username, function(error, result){
    console.log(result);
    response.json(result);
  });
});

//adds a new message, and returns a response containing all messages
app.post('/addbook', function(request, response){
      console.log('hi');   

    var username = request.body.username;   
    var title = request.body.title_name; 
    var author = request.body.author;   
    var class_name = request.body.class_name;   
    var description = request.body.description;
    var price = request.body.price;
    console.log(username);   
    var d = new Date();

    var tmp_path = req.files.photo.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/assets/' + req.files.thumbnail.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
    var sql = 'INSERT INTO books (seller, title, author, class,price, description, time) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    conn.query(sql, [username, title, author, class_name, price, description, d.getTime()/1000], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 AND sold=0 ORDER BY time DESC';
        conn.query(sql, username, function (error, result) {
          console.log(result);
          console.log("MAXAMILION");
            response.json(result);
        });
    });
});

//adds a new message, and returns a response containing all messages
app.post('/remove_post', function(request, response){

    var username = request.body.username;   
    var post_id = request.body.post_id;
    var sql = 'DELETE FROM books where id=$1 and seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
          console.log(result);
          console.log("MAXAMILION");
            response.json(result);
        });
    });
});

//adds a new message, and returns a response containing all messages
app.post('/mark_as_sold', function(request, response){

    var username = request.body.username;   
    var post_id = request.body.post_id;

    var sql = 'UPDATE books SET sold=1 WHERE id=$1 AND seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
          console.log(result);
          console.log("MAXAMILION");
            response.json(result);
        });
    });
});

app.listen(8080);