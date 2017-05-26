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

// uncomment this line to see behavior when each opeartion is forced
// to complete it's callback before the next one starts
// You also need to uncomment a line at the bottom of this file
db.serialize( function () {

	console.log("starting DB operations");
	console.log("Insert");
    // Insert or replace rows into the table
	db.run(
		'INSERT OR REPLACE INTO photoLabels VALUES ("hula.jpg", "", 0)',
		errorCallback);
	db.run(
		'INSERT OR REPLACE INTO photoLabels VALUES ("eagle.jpg", "", 0)',
		errorCallback);
  db.run(
		'INSERT OR REPLACE INTO photoLabels VALUES ("redwoods.jpg", "", 0)',
		errorCallback);

	console.log("Update");
  // Changing data - the UPDATE statement
	db.run(
		'UPDATE photoLabels SET labels = "dance, performing arts, sports, entertainment, quinceañera, event, hula, folk dance" WHERE fileName = "hula.jpg" ', errorCallback);

	console.log("Get Hula labels");
  db.get(
		'SELECT labels FROM photoLabels WHERE fileName = ?',
		["hula.jpg"],dataCallback);


/* Some more examples of database commands you could try
*/
	console.log("Dump database");
  // Dump whole database
  db.all('SELECT * FROM photoLabels',dataCallback);

	console.log("Update");
  // fill-in-the-blanks syntax for Update command
  db.run(
		'UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
		['bird, beak, bird of prey, eagle, vertebrate, bald eagle, fauna, accipitriformes, wing', 'eagle.jpg'],errorCallback);

  db.run(
		'UPDATE photoLabels SET labels = ? WHERE fileName = ? ',
		[ 'habitat, vegetation, natural environment, woodland, tree, forest, green, ecosystem, rainforest, old growth forest', 'redwoods.jpg'],errorCallback);

	console.log("Select labels with bird");
  // Getting all rows where a substring of the "labels" field
  // matches the string "Bird"
  db.all(
		'SELECT * FROM photoLabels WHERE labels LIKE  ?',
		["%bird%"],dataCallback);
/**/

  db.close();

// You need to uncomment the line below when you uncomment the call
// to db.serialize
});
