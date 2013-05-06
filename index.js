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




var http = require('http'); // this is new
var app = express();
var server = http.createServer(app); // this is new

// add socket.io
var io = require('socket.io').listen(server);





  

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
    console.log("HEHEHEHHEHEHEHEHE");
    console.log(result);

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
/*app.post('/login',
  passport.authenticate('local', 
  	{ successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' }));*/

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
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

app.get('/logout', function(req, res){

  req.logout();
  res.redirect('/');
});




//user creation post
app.post('/signup', function(req, res, next){
  console.log("in email");
  var checkEmailUsed = 'SELECT * FROM users WHERE email = $1';
  var email = req.body.username.toLowerCase();
  conn.query(checkEmailUsed, [email], function (error, result) {
    if(result.rowCount  != 0)
    {
      res.json('unauthorized');
      return;
    }
    else
    {
      console.log(email);
      var sql = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)';  
      conn.query(sql, [email, req.body.password, req.body.name], function(error, result){
        passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
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
  // console.log(query);
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

  // console.log(sql);
  // console.log(query);
  // console.log(sort);
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
    //console.log(result);
    response.json(result);
  });
});//search json response, can also use for autocomplete
app.get('/searchauthor/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND author LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    //console.log(result);
    response.json(result);
  });
});
app.get('/searchclass/:query/books.json', function(request,response) {

  var query = request.params.query;
  query = '%' + query + '%';
  var sql = 'SELECT * FROM books WHERE sold=0 AND class LIKE $1 ORDER BY time DESC';
  conn.query(sql, query, function(error, result){
    //console.log(result);
    response.json(result);
  });
});


//search json response, can also use for autocomplete
app.get('/searchTypeAhead/:query/books.json', function(request,response) {
//console.log("unfiltered");
  var query = request.params.query;
  query = '%' + query + '%';
	var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
	conn.query(sql, query, function(error, result){
    //console.log(result);
		response.json(result);
	});
});

// //search json response, can also use for autocomplete
// app.get('/searchTypeAheadFiltered/:query/books.json', function(request,response) {
// console.log("filtered");

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
//   console.log(query);
//   query = '%' + query + '%';
//   var sql = 'SELECT DISTINCT title FROM books WHERE sold=0 AND title LIKE $1 AND highlighter=$2 AND writing=$3 UNION SELECT DISTINCT author FROM books WHERE sold=0 AND author LIKE $1 UNION SELECT DISTINCT class FROM books WHERE sold=0 AND class LIKE $1';
//   conn.query(sql, [query, highlighter, writing], function(error, result){
//     //console.log(result);
//     response.json(result);
//   });
// });

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
    //console.log(result);
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
    //console.log(path);

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


io.sockets.on('connection', function(socket){
    console.log(io.sockets.manager.rooms);
    console.log("just connected");
    // clients emit this when they join new rooms
    socket.on('join', function(username,callback){

        // get a list of messages currently in the room, then send it back
        var sql = 'SELECT * FROM messageThreads WHERE buyer=$1 OR seller=$1 ORDER BY time ASC';
        console.log(username);
        var q = conn.query(sql, [username], function (error, result) {
          console.log(result);
          result = fixMessageThreadResult(result, username);
          console.log(result);
          callback(result);
          console.log(io.sockets.manager.rooms);

        });

        q.on('row', function(row){
          console.log(row);
          socket.join(row.id); // this is a socket.io method

        });

    });

    socket.on('requestMessages', function(threadID, callback){
        var sql = 'SELECT * FROM messages WHERE threadID == $1 ORDER BY time ASC';
        var con = conn.query(sql, [threadID], function (error, result) {         
          callback(result);
        });
    });

    socket.on('requestMessagesUNREAD', function(threadID, callback){
    
    var update = 'UPDATE messageThreads SET seen=0 WHERE id=$1';
      conn.query(sql, [threadID], function (error, result) {  
      var sql = 'SELECT * FROM messages WHERE threadID == $1 ORDER BY time ASC';
      var con = conn.query(sql, [threadID], function (error, result) { 
        callback(result);
     });
    });
});

    socket.on('buyClick', function(username, nickname, seller, seller_nickname, title, post_id, callback){
        var d = new Date();
        var sql = 'SELECT * FROM messageThreads WHERE buyer = $1 AND seller = $2 AND post_id = $3';
        conn.query(sql, [username, seller, post_id], function (error, result) {
          console.log(result);
          if(result.rowCount == 1)
            callback(result);
          else
          {
            console.log("newwwwwww");
            var d = new Date();
            var insertsql = 'INSERT INTO messageThreads (title, buyer, buyer_nickname, seller_nickname, seller, post_id, time, seen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            conn.query(insertsql, [title, username, nickname, seller_nickname, seller, post_id, d.getTime()/1000, 1], function (error, result) {
              conn.query(sql, [username, seller, post_id], function (error, result) {
                console.log(result);
                callback(result);
              });

            });
          }
        });
       
    });

    socket.on('newMessageUpload', function(message, threadID, sender, sender_nickname){
      

        var d = new Date();
        var sql = 'INSERT INTO messages (threadID, sender, time, nickname, content) VALUES ($1, $2, $3, $4, $5)';
        conn.query(sql, [ threadID, sender, d.getTime()/1000, sender_nickname, message], function (error, result) {
          var findBuysql = "SELECT buyer, seller FROM messageThreads WHERE id=$1 ";
          conn.query(findBuysql, [ threadID], function (error, result) {
            console.log(result);
            var updateSeen = "UPDATE messageThreads SET seen = $1 WHERE id = $2 ";

            if(result[0].buyer == sender)
            {
              conn.query(updateSeen, [1, threadID], function (error, result) {
                io.sockets.in(roomName).emit('newMessage', threadID);
              });

            }
            else
            {
              conn.query(updateSeen, [2, threadID], function (error, result) {
                io.sockets.in(roomName).emit('newMessage', threadID);
              });
            }
          });

        });
       
    });



/*    // this gets emitted if a user changes their nickname
    socket.on('nickname', function(nickname){
        socket.nickname = nickname;
        broadcastMembership(socket.roomName);
    });

     //the client emits this when they want to send a message
    socket.on('message', function(message, roomName){
      

        var d = new Date();
        var sql = 'INSERT INTO messages (room, nickname, body, time) VALUES ($1, $2, $3, $4)';
        conn.query(sql, [roomName, socket.nickname, message, d.getTime()/1000], function (error, result) {
            io.sockets.in(roomName).emit('message', socket.nickname, message, d.getTime()/1000);
        });
       
    });
    
    socket.on('home', function(callback){
        var sql = "SELECT DISTINCT room FROM messages;"
        conn.query(sql, function (error, result) {
            callback(result);
        });
    });
*/
    // the client disconnected/closed their browser window
    socket.on('disconnect', function(){

    });
});

function fixMessageThreadResult(result, username)
{
console.log(result);
          for (var i = 0; i < result.rowCount; i++){
            var buyer = result.rows[i].buyer;
            var seller = result.rows[i].seller;
            var seen = result.rows[i].seen;
            var post_id = result.rows[i].post_id;


            if (seen == 0)
            {
              result.rows[i].seen="true";
            }
            else if (buyer == username)
            {
              if (seen == 1)
              {
                result.rows[i].seen="true";
              }
              else if (seen == 2)
              {
                result.rows[i].seen="false";
              }
            }
            else if (seller == username)
            {
              if (seen == 1)
              {
                result.rows[i].seen="false";
              }
              else if (seen == 2)
              {
                result.rows[i].seen="true";
              }
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

// function sendOutMessage(threadID) {
//     // fetch all sockets in a room
//     var sockets = io.sockets.clients(roomName);

//     // pull the nicknames out of the socket objects using array.map(...)
//     var nicknames = sockets.map(function(socket){
//         return socket.nickname;
//     });

//     // send them out
//     io.sockets.in(roomName).emit('membershipChanged', nicknames);
// }






server.listen(8080);




