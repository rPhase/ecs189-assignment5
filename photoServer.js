// Require some outside javascript files
var DBop = require("./DBOps");
var queries = require("./queries");

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

// Case 3: Uploading images
app.post("/", function(request, response){
  // Check incoming form and figures out what files are inside
  var form = new formidable.IncomingForm();
  form.parse(request);

  // When a file begins to be processed
  form.on("fileBegin", function(name, file){
	  console.log("Uploading");
	  // Add file to public directory and database
	  file.path = __dirname + "/public/photo/" + file.name;

		//Closure
		// When a file is fully received
		form.on('end', function (){
			console.log("Upload complete");
			// console.log(response);
			DBop.insertIntoDB(file.name, response);
			sendCode(201, response, 'Received file');  // Respond to browser
		});
	});
});

// Use your own port!
app.listen(10298);

// Respond to browser by sending HTTP response with the given status code and message
function sendCode(code, response, message) {
    response.status(code);
    response.send(message);
}
