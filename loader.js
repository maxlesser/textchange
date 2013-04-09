var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://books.db');

// Your implementation here!


/*

1. Create a table in zipcodes.db (NOTE: if it's already been created this will
   probably cause an error! You should delete it first.)*/


conn.query('CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,class TEXT, seller TEXT, image TEXT, description TEXT, time INTEGER)');

var d = new Date();
for (var i = 0; i < 100; i++)
{
conn.query('INSERT INTO books (title, author, class, seller, image,description, time) VALUES (\'Test' + i + '\', \'Johan\', \'CSCI019\', \'Bob\', \'path\', \'I am a book hi\', '+ d.getTime()/1000 + ')');


}
