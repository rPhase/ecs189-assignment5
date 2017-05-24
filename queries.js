var DBop = require("./DBOps");

// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var sqlite3 = require("sqlite3").verbose();  // Use sqlite

// Open database object called photos.db
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);  // New object, old DB

var querystring = require('querystring'); // Handy for parsing query strings

// Answer queries
function answer(query, response){
  // query looks like: op=add&img=[image filename]&label=[label to add/delete]
  queryObj = querystring.parse(query);

  // Add new label
  if(queryObj.op === "add"){
    DBop.addNewLabel(queryObj, response);
  }
	// Delete a label
  else if(queryObj.op === "delete"){
    DBop.deleteLabel(queryObj, response);
  }
	// get labels
  else if(queryObj.op === "getLabels"){
    DBop.displayLabels(queryObj, response);
  }
	// dump
  else if(queryObj.op === "dump"){
    DBop.dumpDB(response);
  }
}


// Let the outside see these functions
exports.answer = answer;
