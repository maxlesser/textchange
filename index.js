var express = require('express');
var anyDB = require('any-db');
var engines = require('consolidate');
// var request = require('request');
var parseString = require('xml2js').parseString;
var sha1 = require('sha1');

// Server setup
var http = require('http'); // this is new
var app = express();
var server = http.createServer(app); // this is new


// Email example
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "textchangeemail@gmail.com",
        pass: "thisistextchange"
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Textchange", // sender address
    to: "max_lesser@brown.edu", // list of receivers
    subject: "Textchange Confirmation Email", // Subject line
    text: "", // plaintext body
    html: "" // html body
};

// Sends the specified email a confirmation link with generated code
function sendMail(code, email)
{
  mailOptions.text = "Hey there! Thanks for signing up on Textchange. Follow this link to activate your account: http://textchange.jit.su/confirm_signup?code=" + code + "&email=" + email + "\nHappy hunting!\n\n-Textchange Staff (Max)";
  mailOptions.to = email;

  console.log(email);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    console.log("email trying to send");
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  });

  mailOptions.text = "";
  mailOptions.to = "";
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Passport setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function getNickname(username, fn) {
  sql = 'SELECT name FROM users WHERE email = $1';
  conn.query(sql, username, function(error, result) {

    if(result.rowCount === 1)
    {
      fn(null, result.rows[0]);
    }
    else
    {
      fn(new Error('User ' + username + ' does not exist'));
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
    findByUsername(username, sha1(password), function(err, user) {
      if (err) { return done(err); }
      if (!user) { console.log("unknown user"); }
      else if (user.password != sha1(password)) { console.log("wrong password"); }
      return done(null, user);
    });
  }
));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Passport setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DB/Express setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var conn = anyDB.createConnection('sqlite3://books.db');


app.configure(function() {
  app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
  app.set('views', __dirname + '/templates'); // tell Express where to find templates

  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'this is a secret' }));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/assets'})); // definitely use this feature
  app.use(passport.initialize());
  app.use(passport.session());

  //public files like pictures are in public
  app.use('/public', express.static(__dirname + '/public'));
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DB/Express setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Home page response
app.get('/', function(request, response){
  if(request.user == undefined)
	   response.render('home.html', {username: "null", nickname: "null"});
  else
    response.render('home.html', {username: request.user.email, nickname: request.user.name});
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Login/out
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Login response (get)
app.get('/login', function(request, response){
	response.render('login.html', {});
});

//login page post
/*app.post('/login',
  passport.authenticate('local', 
  	{ successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' }));*/

// login response (post)
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (info) {console.log(info) }
    if (err) { console.log(err) }
    if (!user) { 
      res.json("unauthorized");
      return; }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.json("authorized");
      return
    });
  })(req, res, next);
});

// Logout response
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Login/out
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Creation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// user creation post
app.post('/signup', function(req, res, next){

  var checkEmailUsed = 'SELECT (SELECT COUNT(*) FROM users WHERE email = $1) + (SELECT COUNT(*) FROM temp WHERE email = $1) as sumcount';
  var email = req.body.username.toLowerCase();

  var regex = new RegExp(/^\"?[\w-_\.]{1,30}\"?@brown\.edu$/);

  if(!regex.test(email))
  {
    res.json('email_invalid');
    return;
  }
  if(req.body.password.length < 7 || req.body.password.length > 15)
  {
    res.json('password_invalid');
    return
  }
  if(req.body.name.length < 1)
  {
    res.json('no_nickname');
    return
  }

  conn.query(checkEmailUsed, [email], function (error, result) {
    if(result.rows[0].sumcount != 0)
    {
      res.json('email_used');
      return;
    }
    else
    {
      var temp_sql = "INSERT INTO temp (email, password, name, code) values ($1, $2, $3, $4)";
      var code = '_' + Math.random().toString(36).substr(2, 9);

      sendMail(code, email);

      conn.query(temp_sql, [email, sha1(req.body.password), req.body.name, code], function (error, result) {});
      res.json('signed_up');
      return;
    }
  });
});

app.get('/thanks_signup', function(req, res) {
  res.render('splash.html', {status: 'success', splash_message: 'Thanks for signing up! Check your email now for a confirmation email with a link to activate your account.'});
});

app.get('/confirm_signup', function(req, res, next) {
  var insert_users = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)';  
  var remove_temp = 'DELETE FROM temp WHERE email = $1 AND code = $2';
  var check_code = 'SELECT * FROM temp WHERE email = $1 LIMIT 1';
  var code = req.query.code;
  var email = req.query.email;

  conn.query(check_code, [email], function(error, result) {
    // if correct, add info into users db, remove from temp db
    if(result)
    {
      var temp_row = result.rows[0];
      if(temp_row && temp_row.code == code)
      {
        // insert info into users db
        conn.query(insert_users, [temp_row.email, temp_row.password, temp_row.name], function(error, result){
          // remove from temp db
          conn.query(remove_temp, [temp_row.email, temp_row.code], function(error, result) {});

          res.render('splash.html', {status: 'success', splash_message: 'Thanks for confirming your account! Now you can sign in and start buying and selling books!'});
        });
      }
      // if incorrect, redirect to splash with danger and message
      else
      {
        res.render('splash.html', {status: 'danger', splash_message: 'Your confirmation code was incorrect. If you believe this is in error, contact support.'});
      }
    }
    // if incorrect, redirect to splash with danger and message
    else
    {
      res.render('splash.html', {status: 'danger', splash_message: 'Your confirmation code was incorrect. If you believe this is in error, contact support.'});
    }
  });  
});

// Whoami? Not sure what this is or why it's here
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Creation
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Recent books (get)
app.get('/search/recent.json', function(request,response) {
    var sql = "SELECT * FROM books WHERE sold=0 ORDER BY time DESC LIMIT 100";
    conn.query(sql, function (error, result) {
        response.json(result);
    });
});

// search json response, can also use for autocomplete
app.get('/search/:query/books.json', function(request,response) {

  var query = request.params.query;
  if(query.length >=4)
  {
    var writing = query.charAt(query.length-1);
    var highlighter = query.charAt(query.length-2);
    var price = query.charAt(query.length-3);
    var condition = query.charAt(query.length-4);
    query = query.substring(0, query.length-4);
  }
  else
  {
    var price = 0;
    var condition = 0;
    var highlighter = 0;
    var writing = 0;
  }

  query = '%' + query + '%';
  if(writing == 1 && highlighter == 1)
    var sql = 'SELECT * FROM books WHERE sold=0  AND writing=0 AND highlighter=0 AND title LIKE $1 OR author LIKE $1 OR class LIKE $1 ORDER BY $2 DESC';
  else if(writing == 1)
    var sql = 'SELECT * FROM books WHERE sold=0 AND writing=0 AND title LIKE $1 OR author LIKE $1 OR class LIKE $1  ORDER BY $2 DESC';
  else if(highlighter == 1)
    var sql = 'SELECT * FROM books WHERE sold=0 AND highlighter=0 AND title LIKE $1 OR author LIKE $1 OR class LIKE $1  ORDER BY $2 DESC';
  else
    var sql = 'SELECT * FROM books WHERE sold=0 AND title LIKE $1 OR author LIKE $1 OR class LIKE $1  ORDER BY $2 DESC';

  var sort = "time";
  if(price == 1)
    sort = "price";
  else if(condition == 1)
    sort = "condition";

  conn.query(sql, [query, sort], function(error, result){
    response.json(result);
  });
});

//search json response, can also use for autocomplete
app.get('/searchtitle/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND title LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    response.json(result);
  });
});
//search json response, can also use for autocomplete
app.get('/searchauthor/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND author LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    response.json(result);
  });
});
app.get('/searchclass/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND class LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    response.json(result);
  });
});

//search json response, can also use for autocomplete
app.get('/searchTypeAhead/:query/books.json', function(request,response) {
  var query = request.params.query;
  query = '%' + query + '%';
	var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
	conn.query(sql, query, function(error, result){
		response.json(result);
	});
});

// //search json response, can also use for autocomplete
// app.get('/searchTypeAheadFiltered/:query/books.json', function(request,response) {

//   var query = request.params.query;
//   if(query.length >=3)
//   {
//     var writing = query.charAt(query.length-1);
//     var highlighter = query.charAt(query.length-2);
//     query = query.substring(0, query.length-2);
//   }
//   else
//   {
//     highlighter = 0;
//     writing = 0;
//   }
//   query = '%' + query + '%';
//   var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 AND highlighter=$2 AND writing=$3 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
//   conn.query(sql, [query, highlighter, writing], function(error, result){
//     response.json(result);
//   });
// });

//search json response, can also use for autocomplete
app.get('/searchtitleTypeAhead/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT DISTINCT title FROM books WHERE title LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    response.json(result);
  });
});
//search json response, can also use for autocomplete
app.get('/searchauthorTypeAhead/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT DISTINCT author FROM books WHERE author LIKE $1 AND sold=0 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    response.json(result);
  });
});
// //search json response, can also use for autocomplete
// app.get('/searchclass/:query/books.json', function(request,response) {

//   var query = request.params.query;
//   query = '%' + query + '%';
//   var sql = 'SELECT class FROM books WHERE class LIKE $1 AND sold=0 ORDER BY time DESC';
//   conn.query(sql, query, function(error, result){
//     response.json(result);
//   });
// });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Book posts
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//search json response
app.get('/book_posts.json', function(request,response) {

  var username = request.user.email;
  var sql = 'SELECT * FROM books WHERE seller = $1 ORDER BY sold, time DESC';
  conn.query(sql, username, function(error, result){
    response.json(result);
  });
});

//adds a new book for sale, and returns a response containing all books for sale
app.post('/addbook', function(request, response){

    if(!request.user)
    {
      response.end();
      return;
    }

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

    var d = new Date();

    var sql = 'INSERT INTO books (seller, seller_nickname, title, author, class,price, description, image, time, writing, highlighter, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    conn.query(sql, [username, nickname, title, author, class_name, price, description, path, d.getTime()/1000, writing, highlighter, condition], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold,time DESC';
        conn.query(sql, username, function (error, result) {
            response.json(result);
        });
    });
});

//adds a new book for sale, and returns a response containing all books for sale
app.post('/remove_post', function(request, response){

    if(!request.user)
    {
      response.end();
      return;
    }

    var username = request.user.email;   
    var post_id = request.body.post_id;
    var sql = 'DELETE FROM books where id=$1 and seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
            response.json(result);
        });
    });
});

// marks a book as sold
app.post('/mark_as_sold', function(request, response){
  
    if(!request.user)
    {
      response.end();
      return;
    }

    var username = request.user.email;   
    var post_id = request.body.post_id;

    var sql = 'UPDATE books SET sold=1 WHERE id=$1 AND seller=$2';
    conn.query(sql, [post_id, username], function (error, result) {
        var sql = 'SELECT * FROM books WHERE seller=$1 ORDER BY sold, time DESC';
        conn.query(sql, username, function (error, result) {
            response.json(result);
        });
    });
});

// Gets book info by isbn
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Book posts
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Messages
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Requests all message threads for a user
app.get('/messages/requestAllThreads', function(req, res) {
  if(!req.user)
  {
    res.end();
    return;
  }
  var sql = 'SELECT * FROM messageThreads WHERE buyer=$1 OR seller=$1 ORDER BY time ASC';
  var q = conn.query(sql, [req.user.email], function (error, result) {
    result = fixMessageThreadResult(result, req.user.email);  
    res.json(result);
  });
});

// Requests all messages for a thread
app.get('/messages/requestThread', function(req, res) {
  if(!req.user)
  {
    res.end();
    return;
  }
  var sql = 'SELECT * FROM messages WHERE threadID == $1 ORDER BY time ASC';
  var con = conn.query(sql, [req.query.threadID], function (error, result) {    
    res.json(result);
  });
});

// Requests all threads that have unread messages
app.get('/messages/requestUnreadThreads', function(req, res){
  if(!req.user)
  {
    res.end();
    return;
  }
  var sql = 'SELECT id FROM messageThreads WHERE (buyer = $1 OR seller = $1) AND seen = 1 AND last_poster != $1';
  var con = conn.query(sql, [req.user.email], function (error, result) 
  { 
    res.json(result);
  });
});

// set a thread as read
app.post('/messages/threadRead', function(req, res)
{
  if(!req.user)
  {
    res.end();
    return;
  }
  var sql = 'UPDATE messageThreads SET seen=0 WHERE id = $1 AND seen = 1 AND last_poster != $2';
  var con = conn.query(sql, [req.body.threadID, req.user.email], function (error, result) {});
});

// Creates a new message thread
app.post('/messages/buyClick', function(req, res) {

  if(!req.user)
  {
    res.end();
    return;
  }

  var d = new Date();
  var sql = 'SELECT * FROM messageThreads WHERE buyer = $1 AND seller = $2 AND post_id = $3';
  conn.query(sql, [req.user.email, req.body.seller, req.body.post_id], function (error, result) 
  {
    if(result.rowCount == 1)
      res.json(result);
    else
    {
      var d = new Date();
      var insertsql = 'INSERT INTO messageThreads (title, buyer, buyer_nickname, seller_nickname, seller, post_id, time, seen, last_poster) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      conn.query(insertsql, [req.body.title, req.user.email, req.user.name, req.body.seller_nickname, req.body.seller, req.body.post_id, d.getTime()/1000, 1, req.user.email], function (error, result) 
      {
        conn.query(sql, [req.user.email, req.body.seller, req.body.post_id], function (error, finalR) 
        {
          res.json(finalR);
        });
      });
    }
  });  
});

// Posts a new message in a thread
app.post('/messages/post', function(req, res) 
{

  if(!req.user)
  {
    res.end();
    return;
  }
  var d = new Date();
  var sql = 'INSERT INTO messages (threadID, sender, nickname, time, content) VALUES ($1, $2, $3, $4, $5)';
  conn.query(sql, [ req.body.threadID, req.user.email, req.user.name, d.getTime()/1000, req.body.message], function (error, result) 
  {
    var findBuysql = "SELECT buyer, seller FROM messageThreads WHERE id=$1 ";
    conn.query(findBuysql, [ req.body.threadID], function (error, result) 
    {
      var updateSeen = "UPDATE messageThreads SET seen = $1, last_poster = $2 WHERE id = $3";

      conn.query(updateSeen, [1, req.user.email, req.body.threadID], function (error, result) {
        res.end();
      });
    });
  });
});
  

// Gets a thread's info
app.get('/messages/threadInfo', function(req, res){
  if(!req.user)
  {
    res.end();
    return;
  }
  var sql = 'SELECT * FROM messageThreads WHERE id = $1';
  conn.query(sql, [req.query.threadID], function (error, result) {
    res.json(result);
  });
   
});

// Formats message threads, perhaps
function fixMessageThreadResult(result, username)
{
  for (var i = 0; i < result.rowCount; i++){
    var last_poster = result.rows[i].last_poster;
    var seen = result.rows[i].seen;
    var buyer = result.rows[i].buyer;

    if (seen == 0)
    {
      result.rows[i].seen="true";
    }
    else if (seen == 1 && last_poster == username)
    {
      result.rows[i].seen="true";
    }

    var nickname;
    if(username == buyer)
    {
      nickname = result.rows[i].seller_nickname;
    }
    else
    {
      nickname = result.rows[i].buyer_nickname;

    }

    result.rows[i].other_name=nickname;
  }

  return result;
}

// setInterval(function() 
// {
//   // select all users where user is in a messageThread and user is not the last poster
//   // for each user, if that user's email is in
//   // 'SELECT id FROM messageThreads WHERE (buyer = $1 OR seller = $1) AND seen = 1 AND last_poster != $1';
//   // get that user's id
//   var unread_users = "SELECT * FROM users WHERE email IN ()"

//   // for each user 
// }, delay);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Messages
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



server.listen(8080);
