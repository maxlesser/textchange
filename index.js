var express = require('express');

var anyDB = require('any-db');

var engines = require('consolidate');

var flash = require('connect-flash');


var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "textchangeemail@gmail.com",
        pass: "thisistextchange"
    }
});
var mailOptions = {
    from: "Max Lesser", // sender address
    to: "andy_chen@brown.edu", // list of receivers
    subject: "suck me", // Subject line
    text: "Hello world", // plaintext body
    html: "<b>Hello world </b>" // html body
}

var fs = require('fs');

var request = require('request');


var parseString = require('xml2js').parseString;


  

//passport setup
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


function findById(id, fn) {
  sql = 'SELECT * FROM users WHERE id = $1';
  conn.query(sql, id, function(error, result) {
    var idx = id - 1;

    if(result.rowCount === 1)
    {
      fn(null, result.rows[0]);
    }
    else
    {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });  
}

function findByUsername(username, password, fn) {
  sql = 'SELECT * FROM users WHERE email = $1 AND password = $2';

  conn.query(sql, [username, password], function(error, result){

    if(result.rowCount === 1)
    {
      return fn(null, result.rows[0]);
    }
    else
    {
      return fn(null, null);
    }
  });
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
    findByUsername(username, password, function(err, user) {
      if (err) { return done(err); }
      if (!user) { console.log("unknown user"); }
      else if (user.password != password) { console.log("wrong password"); }
      return done(null, user);
    });
  }
));



var conn = anyDB.createConnection('sqlite3://books.db');
var app = express();

app.configure(function() {
  app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
  app.set('views', __dirname + '/templates'); // tell Express where to find templates

  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'this is a secret' }));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/assets'})); // definitely use this feature
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  //public files like pictures are in public
  app.use('/public', express.static(__dirname + '/public'));
});




//home page response
app.get('/', function(request, response){
  // smtpTransport.sendMail(mailOptions, function(error, response){
  //   if(error){
  //       console.log(error);
  //   }else{
  //       console.log("Message sent: " + response.message);
  //   }
  // });
  if(request.user == undefined)
	   response.render('home.html', {username: "null", nickname: "null"});
  else
    response.render('home.html', {username: request.user.email, nickname: request.user.name});
});


//home page response
app.get('/login', function(request, response){
	response.render('login.html', {message: request.flash('error')});
});

//login page post
app.post('/login',
  passport.authenticate('local', 
  	{ successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


//User creation response
app.get('/signup', function(request, response){
  console.log(request.user);
  if(typeof request.user !== 'undefined') 
    response.render('create_user.html', {username: request.user.email});
  else
    response.render('create_user.html');
});

//user creation post
app.post('/signup', function(request, response){
  var checkEmailUsed = 'SELECT * FROM users WHERE email = $1';
  var email = request.body.username.toLowerCase();
  conn.query(checkEmailUsed, [email], function (error, result) {
    if(result.rowCount  != 0)
    {
      response.redirect('/signup');
    }
    else
    {
      console.log(email);
      var sql = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)';  
      conn.query(sql, [email, request.body.password, request.body.name], function(error, result){
        passport.authenticate('local', 
          { successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' })(request, response);
      });
    }
  });
});


app.get('/whoAmI', function(request, response){

  if (request.user == undefined)
  {
    response.json("n/a");
  }
  else
  {
    response.json(request.user.email);
  }

});

app.get('/search/recent.json', function(request,response) {
    var sql = "SELECT * FROM books WHERE sold=0 ORDER BY time DESC LIMIT 100";
    conn.query(sql, function (error, result) {
        //console.log(result);
        response.json(result);
    });
});

//search json response, can also use for autocomplete
app.get('/search/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND title LIKE $1 OR author LIKE $1 OR class LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    //console.log(result);
    response.json(result);
  });
});

//search json response, can also use for autocomplete
app.get('/searchtitle/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE title LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    //console.log(result);
    response.json(result);
  });
});//search json response, can also use for autocomplete
app.get('/searchauthor/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE AUTHOR LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    console.log(result);
    response.json(result);
  });
});


//search json response, can also use for autocomplete
app.get('/searchTypeAhead/:query/books.json', function(request,response) {
console.log("unfiltered");
  var query = request.params.query;
  query = '%' + query + '%';
	var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
	conn.query(sql, query, function(error, result){
    //console.log(result);
		response.json(result);
	});
});

//search json response, can also use for autocomplete
app.get('/searchTypeAheadFiltered/:query/books.json', function(request,response) {
console.log("filtered");

  var query = request.params.query;
  if(query.length >=3)
  {
    var highlighter = query.charAt(query.length-1);
    var writing = query.charAt(query.length-2);
    var condition = query.charAt(query.length-3);
    query = query.substring(0, query.length-3);
  }
  else
  {
    highlighter = 0;
    writing = 0;
    condition = 0;
  }
  query = '%' + query + '%';
  var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 AND highlighter=$2 AND writing=$3 AND condition=$4 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
  conn.query(sql, [query, highlighter, writing, condition], function(error, result){
    //console.log(result);
    response.json(result);
  });
});

//search json response, can also use for autocomplete
app.get('/searchtitleTypeAhead/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT DISTINCT title FROM books WHERE title LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    //console.log(result);
    response.json(result);
  });
});//search json response, can also use for autocomplete
app.get('/searchauthorTypeAhead/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT DISTINCT author FROM books WHERE author LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    console.log(result);
    response.json(result);
  });
});
// //search json response, can also use for autocomplete
// app.get('/searchclass/:query/books.json', function(request,response) {

//   var query = request.params.query;
//   query = '%' + query + '%';
//   var sql = 'SELECT class FROM books WHERE class LIKE $1 AND sold=0 ORDER BY time DESC';
//   conn.query(sql, query, function(error, result){
//     //console.log(result);
//     response.json(result);
//   });
// });



//search json response
app.get('/book_posts.json', function(request,response) {

  var username = request.user.email;
  //console.log(username);
  var sql = 'SELECT * FROM books WHERE seller = $1 ORDER BY sold, time DESC';
  conn.query(sql, username, function(error, result){
    //console.log(result);
    response.json(result);
  });
});

//adds a new message, and returns a response containing all messages
app.post('/addbook', function(request, response){
      //console.log('hi');   

    var username = request.user.email;   
    var nickname = request.user.name;   

    var title = request.body.title_name; 
    var author = request.body.author;   
    var class_name = request.body.class_name;   
    var description = request.body.description;
    var price = request.body.price;
    var path = request.files.photo.path;
    var writing = request.body.writing;
    var highlighter = request.body.highlighter;
    var condition = request.body.condition;
    console.log(path);

    //console.log(username);   
    var d = new Date();


    //console.log(request.files.photo.path);
    //console.log(request.files.photo.type);
    //console.log(request.files.photo.name);
    var sql = 'INSERT INTO books (seller, seller_nickname, title, author, class,price, description, image, time, writing, highlighter, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    conn.query(sql, [username, nickname, title, author, class_name, price, description,path, d.getTime()/1000, writing, highlighter, condition], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold,time DESC';
        conn.query(sql, username, function (error, result) {
          //console.log(result);
          //console.log("MAXAMILION");
            response.json(result);
        });
    });
});

//adds a new message, and returns a response containing all messages
app.post('/remove_post', function(request, response){

    var username = request.user.email;   
    var post_id = request.body.post_id;
    var sql = 'DELETE FROM books where id=$1 and seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
          //console.log(result);
          //console.log("MAXAMILION");
            response.json(result);
        });
    });
});

//adds a new message, and returns a response containing all messages
app.post('/mark_as_sold', function(request, response){

    var username = request.user.email;   
    var post_id = request.body.post_id;
    //console.log(username + " " + post_id);

    var sql = 'UPDATE books SET sold=1 WHERE id=$1 AND seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
          //console.log(result);
          //console.log("MAXAMILION");
            response.json(result);
        });
    });
});

app.get('/isbn/:number', function(req, res){

  var number = req.params.number;
  request({
    uri: "http://isbndb.com/api/books.xml?access_key=5LNGRQ4H&amp;index1=isbn&amp;value1="+number,
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
  }, function(error, response, body) {

      parseString(body, function (err, result) {
        res.json(result);
      });
  });
});




app.listen(8080);




