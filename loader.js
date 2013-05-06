var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://books.db');



conn.query('CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,class TEXT, seller TEXT,seller_nickname TEXT, image TEXT, price INTEGER, description TEXT, writing BOOLEAN, highlighter BOOLEAN, condition INTEGER, time INTEGER, sold BOOLEAN DEFAULT 0 NOT NULL)');

conn.query('CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, threadID INTEGER, sender TEXT, nickname TEXT, time INTEGER, content TEXT)');
conn.query('CREATE TABLE messageThreads (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, buyer TEXT,buyer_nickname TEXT,seller_nickname TEXT , seller TEXT, post_id INTEGER, time INTEGER, seen INTEGER)');


conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT,password TEXT,name TEXT)');

var d = new Date();

for (var i = 0; i < 100; i++)
{
conn.query('INSERT INTO books (title, author, class, seller, seller_nickname, image,price,description, writing, highlighter, condition, time) VALUES (\'Test' + i + '\', \'Johan\', \'CSCI019\', \'Bob@gmail\', \'Bob\', \'public/assets/testbook.jpeg\',' + i + ',\'I am a book hi\', 0, 1, 2, '+ d.getTime()/1000 +')');


}

conn.query('INSERT INTO messageThreads (title, buyer, buyer_nickname, seller_nickname, seller, post_id, time, seen) VALUES ("Im a title",  \'andy@nyc.rr.com\',"Andy Lesser","Max Lesser",\'wheels@nyc.rr.com\',1, 1000, 1)');
conn.query('INSERT INTO messageThreads (title, buyer, buyer_nickname, seller_nickname, seller, post_id, time, seen) VALUES ("Im a title", \'wheels@nyc.rr.com\', "Max Lesser", "Andy Lesser", \'andy@nyc.rr.com\', 2, 1001, 0)');
conn.query('INSERT INTO messageThreads (title, buyer, buyer_nickname, seller_nickname, seller, post_id, time, seen) VALUES ("Im a title", \'wheels@nyc.rr.com\',"Max Lesser", "Andy Lesser", \'andy@nyc.rr.com\', 3, 1002, 2)');



conn.query('INSERT INTO users (email, password, name) VALUES (\'wheels@nyc.rr.com\', \'test\', \'Max Lesser\')');
conn.query('INSERT INTO users (email, password, name) VALUES (\'andy@nyc.rr.com\', \'test\', \'Andy Lesser\')');
