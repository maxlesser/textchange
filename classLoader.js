var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://classes.db');

var parsed = require('./all_classes.json');

conn.query('CREATE TABLE classes (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, title TEXT)');

for (var key in parsed)
{
	conn.query('INSERT INTO classes (name, title) VALUES ($1, $2)', [key, parsed[key]]);
}

conn.query('SELECT * FROM classes', function (error, result) {
        console.log(result);
    });
