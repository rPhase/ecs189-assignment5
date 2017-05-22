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
	console.log(queryObj.op);
//==============================================================================
  if (queryObj.op == "add") {
		console.log("Adding");
		var newLabel = queryObj.label;
		var imageFile = queryObj.img;
		if (newLabel && imageFile) {
			// good add query
			// go to database!
			db.get(
				'SELECT labels FROM photoLabels WHERE fileName = ?',
				[imageFile], getCallbackAdd);

			// define callback inside queries so it knows about imageFile
			// because closure!
	    function getCallbackAdd(err,data) {
				console.log("getting labels from "+imageFile);
				// console.log(data);
				var arrayLabel = data.labels.split(", ");
				if (arrayLabel.indexOf(newLabel)!=-1) {
					console.log("duplicate tag\n");
					response.status(200);
					response.type("text/plain");
					response.send("label "+newLabel+" is a duplicate");
				}
				else {
					if (err) {
						console.log("error: ",err,"\n");
					} else {
						// good response...so let's update labels
						var labelString;
						if (data.labels == "") {
							labelString = newLabel;
						} else {
							labelString = data.labels + ", " + newLabel;
						}
						console.log(labelString);
						db.run(
							'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
							[labelString, imageFile],
							updateCallbackAdd);
						}
				}
	    }

			// Also define this inside queries so it knows about
			// response object
			function updateCallbackAdd(err) {
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
//==============================================================================
	if (queryObj.op == "delete") {
		console.log("deleting");
		var newLabel = queryObj.label;
		var imageFile = queryObj.img;
		if (newLabel && imageFile) {
			// good delete query
			// go to database!
			db.get(
				'SELECT labels FROM photoLabels WHERE fileName = ?',
				[imageFile], getCallbackDel);

			// define callback inside queries so it knows about imageFile
			// because closure!
	    function getCallbackDel(err,data) {
				console.log("getting labels from "+imageFile);
				// console.log(data);
				var arrayLabel = data.labels.split(", ");
				var indexLabel = arrayLabel.indexOf(newLabel);
				if (indexLabel==-1) {
					console.log("label does not exist\n");
					response.status(200);
					response.type("text/plain");
					response.send("label "+newLabel+" does not exist");
				}
				else {
					if (err) {
						console.log("error: ",err,"\n");
					} else {
						// good response...so let's update labels
						arrayLabel = arrayLabel.splice(indexLabel, 1);
						var labelString = "";
						for (i = 0; i < arrayLabel.length; i++) {
							labelString = labelString + arrayLabel[i];
							if (i != arrayLabel.length-1) {
								labelString = labelString + ", ";
							}
						}
						console.log(labelString);
						db.run(
							'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
							[labelString, imageFile],
							updateCallbackDel);
						}
				}
	    }

			// Also define this inside queries so it knows about
			// response object
			function updateCallbackDel(err) {
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
