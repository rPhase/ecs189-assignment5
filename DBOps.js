
// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var sqlite3 = require("sqlite3").verbose();  // Use sqlite

// Open database object called photos.db
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);  // New object, old DB


// function errorCallback(err) {
// 	if (err) {
// 		console.log("error: ",err,"\n");
// 	}
// }

// function dataCallback(err, tableData) {
//     if (err) {
//         console.log("error: ",err,"\n");
//     } else {
//         console.log("got: ",tableData,"\n");
//     }
// }

// Add new file entry into the database
function insertIntoDB(filename, tags, response){
	db.run(
		'INSERT OR REPLACE INTO PhotoLabels VALUES (?, ?, 0)',
		[filename, tags], runCallback);

	function runCallback(err){
		if (err) {
			console.log("error: ", err , "\n");
		} else {
			console.log("upload complete");
		}
	}
}

// Add new label to image
function addNewLabel(queryObj, response){
	var newLabel = queryObj.label;
	var imageFile = queryObj.img;
	if (newLabel && imageFile) {
		// Go to the database and get labels from PhotoLabels table
		db.get(
			'SELECT labels FROM PhotoLabels WHERE fileName = ?',
			[imageFile], getCallback);

		// Define callback inside queries so it knows about imageFile
		function getCallback(err, data) {
			console.log("Getting labels from " + imageFile + " to update");
			if (err) {
				console.log("error: ", err , "\n");
			} else {
				// Check for duplicate labels
				var arrayLabel = data.labels.split(", ");
				if (arrayLabel.indexOf(newLabel)!=-1) {
					console.log("duplicate label\n");
					sendCode(401, response, "Duplicate Label.");
					// Maybe respond later so the user knows about duplicate tags
				} else {
					var labelString;
					if (data.labels == "") {
						labelString = newLabel;
					} else {
						labelString = data.labels + ", " + newLabel;
					}
					// Add a label by updating labels
					db.run(
						'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
						[labelString, imageFile],
						updateCallback);
				}
			}
		}
		// Also define this inside queries so it knows about response object
		function updateCallback(err) {
			console.log("Updating/adding labels for " + imageFile + "\n");
			if (err) {
				console.log("error: ", err , "\n");
				sendCode(400, response, "Requested photo not found");
			} else {
				// Done adding, send response to browser
				response.status(200);
				response.type("text/plain");
				response.send("added label " + newLabel + " to " + imageFile);
			}
		}
	}
}

// Display labels
function displayLabels(queryObj, response){
	var imageFile = queryObj.img;
	if (imageFile){
		// Go to the database and get labels from PhotoLabels table
		db.get(
			'SELECT labels FROM PhotoLabels WHERE fileName = ?',
			[imageFile], getCallback);

		function getCallback(err, data){
			console.log("Getting labels from " + imageFile + " to display");
			if (err) {
				console.log("error: ", err , "\n");
			} else {
				console.log(data);
				// Send response to browser
				response.status(200);
				response.type("json");
				response.send(data);
			}
		}
	}
}

// Delete label from image
function deleteLabel(queryObj, response){
	var deleteLabel = queryObj.label;
	var imageFile = queryObj.img;
	if (deleteLabel && imageFile) {
		// Go to the database and get labels from PhotoLabels table
		db.get(
			'SELECT labels FROM PhotoLabels WHERE fileName = ?',
			[imageFile], getCallback);

		// Define callback inside queries so it knows about imageFile
		function getCallback(err, data) {
			console.log("Getting labels from " + imageFile + " to update");
			if (err) {
				console.log("error: ", err , "\n");
			} else {
				// Search for label
				var labels = data.labels.split(", ");
				var updateLabels = "";
				for(var i = 0; i < labels.length; i++){
					if(labels[i] !== deleteLabel && labels[i] !== ""){
						updateLabels += labels[i] + ", ";
					}
				}
				console.log("labels: " + data.labels);
				console.log("updateLabels: " + updateLabels);

				db.run(
					'UPDATE photoLabels SET labels = ? WHERE fileName = ?',
					[updateLabels, imageFile], updateCallback);
			}
		}
		function updateCallback(err){
			console.log("Updating/deleting labels for " + imageFile + "\n");
			if (err) {
				console.log("error: ", err , "\n");
				sendCode(400, response, "Requested photo not found");
			} else {
				// Done deleting, send response to browser
				response.status(200);
				response.type("text/plain");
				response.send("deleted label " + deleteLabel + " from " + imageFile);
			}
		}
	}
}

// Respond to browser by sending HTTP response with the given status code and message
function sendCode(code, response, message) {
	response.status(code);
	response.send(message);
}

// Dump the database to client
function dumpDB(response) {
	db.all('SELECT * FROM photoLabels',dataCallback);
	function dataCallback(err, tableData) {
		if (err) {
			console.log("error: ",err,"\n");
		} else {
			response.status(200);
			response.type("text/json");
			response.send(tableData);
		}
	}
}

// Set favorites
function setFavorite(queryObj, response, value) {
	var imageFile = queryObj.img;
	// update the favorite boolean with value
	db.run(
		'UPDATE photoLabels SET favorite = ? WHERE fileName = ?',
		[value, imageFile],
		updateCallback);

	// Also define this inside queries so it knows about response object
	function updateCallback(err) {
		if (value == 1) {
			var msg = "Added " + imageFile + " to favorites";
			console.log(msg +"\n");
		} else {
			var msg = "Removed " + imageFile + " from favorites";
			console.log(msg +"\n");
		}
		if (err) {
			console.log("error: ", err , "\n");
			sendCode(400, response, "Requested photo not found");
		} else {
			// Done adding, send response to browser
			response.status(200);
			response.type("text/plain");
			response.send(msg);
		}
	}
}


// Let the outside see these functions
exports.insertIntoDB = insertIntoDB;
exports.addNewLabel = addNewLabel;
exports.deleteLabel = deleteLabel;
exports.displayLabels = displayLabels;
exports.setFavorite = setFavorite;
exports.dumpDB = dumpDB;
