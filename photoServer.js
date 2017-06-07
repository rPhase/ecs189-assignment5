var port = 10298; // Ryan's
// var port = 12520; // Lanh's
// var url = "http://localhost:"+port;
var url = "http://138.68.25.50:"+port;

// Require some outside javascript files
var DBop = require("./DBOps");
var queries = require("./queries");
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// we upload images in forms
// this is good for parsing forms and reading in the images
var formidable = require("formidable");

// Express framework to help handle the server
var express = require("express");
var app = express();

// Start of pipeline
// Case 1: Serving static files
app.use(express.static('public')); // Serve static files from public dir

// Case 2: Answering queries (ex: "138.68.25.50:???/query?img=hula")
app.get("/query", function(request, response){
	var query = request.url.split("?")[1];  // Get query string
	if(query){
		queries.answer(query, response);
	} else {
		sendCode(400, response, 'query not recognized');
	}
});


var LIVE = true;
// URL containing the API key
var APIurl = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDmqfn4_ar6jhgKNbvno7mKCIUhD7fOkKk';

function getGCV(fname, browserResponse) {
	// An object that gets stringified and sent to the API in the body of an HTTP request
	var requestObject = {
		"requests": [ {
			"image": { "source": {"imageUri": url + "/photo/" + fname} },
			"features": [{ "type": "LABEL_DETECTION" }]
		} ]
	}
	// Makes a request to the API, Uses the Node request module, which packs up and sends off an XMLHttpRequest.
	request(
		// HTTP header stuff
		{
			url: APIurl,
			method: "POST",
			headers: {"content-type": "application/json"},
			// stringifies object and puts into HTTP request body as JSON
			json: requestObject,
		},
		// callback function for API request
		APIcallback
	);
	// Get tags from API
	function APIcallback(err, APIresponse, body) {
		var tags = "";
		if ((err) || (APIresponse.statusCode != 200)) {
			console.log("Got API error");
		} else {
			APIresponseJSON = body.responses[0].labelAnnotations;

			// For each tag, concatenate into a string
			for(var i = 0; i < APIresponseJSON.length; i++){
				// console.log(APIresponseJSON[i].description);
				tags += APIresponseJSON[i].description + ", ";
			}
			// Insert into the database
			DBop.insertIntoDB(fname, tags, browserResponse);

			// Send response back to browser
			browserResponse.status(201);
			browserResponse.type("json");
			browserResponse.send(APIresponseJSON);
		}
	}
}

function getFake(fname, browserResponse) {
	// send fake
	var fake = { labelAnnotations: [
		{ mid: '/m/026bk', description: 'fakeLabel1', score: 0.89219457 },
		{ mid: '/m/05qjc', description: 'fakeLabel2', score: 0.87477195 },
		{ mid: '/m/06ntj', description: 'fakeLabel3', score: 0.7928342 },
		{ mid: '/m/02jjt', description: 'fakeLabel4', score: 0.7739482 },
		{ mid: '/m/02_5v2', description: 'fakeLabel5', score: 0.70231736 }]};
	APIresponseJSON = fake.labelAnnotations;
	var tags = "";
	// For each tag, concatenate into a string
	for(var i = 0; i < APIresponseJSON.length; i++){
		// console.log(APIresponseJSON[i].description);
		tags += APIresponseJSON[i].description + ", ";
	}
	// Insert into the database
	DBop.insertIntoDB(fname, tags, browserResponse);

	// Send response back to browser
	browserResponse.status(201);
	browserResponse.type("json");
	browserResponse.send(APIresponseJSON);
}

// Case 3: Uploading images
app.post("/", function(browserRequest, browserResponse){
	// Check incoming form and figures out what files are inside
	var form = new formidable.IncomingForm();
	form.parse(browserRequest);

	// When a file begins to be processed
	form.on("fileBegin", function(name, file){
		console.log("Uploading");

		// Add file to public directory
		file.path = __dirname + "/public/photo/" + file.name;

		// When a file is fully received, get tags from Google Cloud Vision API and add to database
		form.on('end', function (){
			console.log("File received");
			if (LIVE) {
				// Get real tags from Google
				getGCV(file.name, browserResponse);
			} else {
				// Get fake tags
				setTimeout(function(){getFake(file.name, browserResponse);}, 1500);
			}
		});
	});
});


// Use your own port!
app.listen(port);

// Respond to browser by sending HTTP response with the given status code and message
function sendCode(code, response, message) {
    response.status(code);
    response.send(message);
}
