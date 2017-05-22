// Doing stuff with a database in Node.js

// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile);  // new object, old DB


// SERVER CODE
// Handle request to add a label
var querystring = require('querystring'); // handy for parsing query strings

function answer(query, response) {
	// query looks like: op=add&img=[image filename]&label=[label to add]
	queryObj = querystring.parse(query);
  if (queryObj.op == "add") {
		var newLabel = queryObj.label;
		var imageFile = queryObj.img;
		if (newLabel && imageFile) {
			// good add query
			// go to database!
			db.get(
				'SELECT labels FROM photoLabels WHERE fileName = ?',
				[imageFile], getCallback);

			// define callback inside queries so it knows about imageFile
			// because closure!
	    function getCallback(err,data) {
				console.log("getting labels from "+imageFile);
				// console.log(data);
				var arrayLabel = data.labels.split(", ");
				if (arrayLabel.contains(newLabel)) {
					console.log("duplicate tag\n");
					sendCode(400,response,"duplicate tag");
				}
				else {
					if (err) {
						console.log("error: ",err,"\n");
						sendCode(400,response,"unable to get tags");
					} else {
						// good response...so let's update labels
						var labelString;
						if (data.labels == "") {
							labelString = newLabel;
						} else {
							labelString = labelString + ", " + newLabel;
						}
						db.run(
							'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
							[labelString, imageFile],
							updateCallback);
						}
				}
	    }

			// Also define this inside queries so it knows about
			// response object
			function updateCallback(err) {
				console.log("updating labels for "+imageFile+"\n");
				if (err) {
					console.log(err+"\n");
					sendCode(400,response,"requested photo not found");
				} else {
					// send a nice response back to browser
					response.status(200);
					response.type("text/plain");
					response.send("added label "+newLabel+" to "+imageFile);
				}
	    }
		}
	}
}

exports.answer = answer;
