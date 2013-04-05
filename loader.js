var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://books.db');

// Your implementation here!


/*

1. Create a table in zipcodes.db (NOTE: if it's already been created this will
   probably cause an error! You should delete it first.)*/


conn.query('CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,author TEXT,class TEXT, time INTEGER);');

conn.query('INSERT INTO books (title, author, class, time) VALUES (\'Test1\', \'Johan\', \'CSCI019\', 100)');

conn.query('INSERT INTO books (title, author, class, time) VALUES (\'Test2\', \'Johan\', \'CSCI019\', 100)')
conn.query('INSERT INTO books (title, author, class, time) VALUES (\'Test3\', \'Johan\', \'CSCI019\', 100)')
conn.query('INSERT INTO books (title, author, class, time) VALUES (\'Test4\', \'Johan\', \'CSCI019\', 100)')
conn.query('INSERT INTO books (title, author, class, time) VALUES (\'Test5\', \'Johan\', \'CSCI019\', 100)')