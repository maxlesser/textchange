var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://books.db');

// Your implementation here!


/*

1. Create a table in zipcodes.db (NOTE: if it's already been created this will
   probably cause an error! You should delete it first.)*/


conn.query('CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,class TEXT, seller TEXT, image TEXT, price INTEGER, description TEXT, time INTEGER, sold BOOLEAN DEFAULT 0 NOT NULL)');

conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT,password TEXT,name TEXT)');

var d = new Date();

for (var i = 0; i < 100; i++)
{
conn.query('INSERT INTO books (title, author, class, seller, image,price,description, time) VALUES (\'Test' + i + '\', \'Johan\', \'CSCI019\', \'Bob\', \'path\',' + i + ',\'I am a book hi\', '+ d.getTime()/1000 +')');


}




conn.query('INSERT INTO users (email, password, name) VALUES (\'wheels@nyc.rr.com\', \'test\', \'Max Lesser\')');
conn.query('INSERT INTO users (email, password, name) VALUES (\'andy@nyc.rr.com\', \'test\', \'Andy Lesser\')');
