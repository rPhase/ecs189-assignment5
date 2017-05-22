// Doing stuff with a database in Node.js

// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB

function errorCallback(err) {
    if (err) {
	console.log("error: ",err,"\n");
    }
}

function dataCallback(err, tableData) {
    if (err) {
	console.log("error: ",err,"\n");
    } else {
	console.log("got: ",tableData,"\n");
    }
}


function insertIntoDB(fname) {
	var cmd = 'INSERT OR REPLACE INTO photoLabels VALUES ("' + fname +'", "", 0)';
	console.log(cmd);
// 	db.run(
// 'INSERT OR REPLACE INTO photoLabels VALUES ("hula.jpg", "", 0)',
// errorCallback);
}
