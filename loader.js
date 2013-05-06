var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://books.db');



conn.query('CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,class TEXT, seller TEXT,seller_nickname TEXT, image TEXT, price INTEGER, description TEXT, writing BOOLEAN, highlighter BOOLEAN, condition INTEGER, time INTEGER, sold BOOLEAN DEFAULT 0 NOT NULL)');

conn.query('CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, threadID INTEGER, sender TEXT, nickname TEXT, time INTEGER, content TEXT)');
conn.query('CREATE TABLE messageThreads (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, buyer TEXT,buyer_nickname TEXT,seller_nickname TEXT , seller TEXT, post_id INTEGER, time INTEGER, seen INTEGER)');


conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT,password TEXT,name TEXT)');
