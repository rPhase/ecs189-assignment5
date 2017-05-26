// var url = "http://138.68.25.50:10298";
var url = "http://localhost:10298";
dumpDB2();

function checkLabel(label) {
    // remove leading and trailing whitespace and URL encode the label
    label = label.replace(/\s+/g, ' ').trim().toLowerCase();
    label = encodeURIComponent(label);
    if (label) {
        return label;
    } else {
        alert("Invalid Label.");
        return undefined;
    }
}

function toggleSidebar(option) {
  var acc = document.getElementById(option);
  /* Toggle between hiding and showing the active panel */

  if (acc.style.display === "block") {
    acc.style.display = "none";
  } else {
    acc.style.display = "block";
  }
}

// TODO: dump labels along with the images from database
// TODO: make another function to add functionality to the add button since dumpDB() and uploadFile() are very similar

// Create a photoBox container
function createPhotoBox(entry, id) {
	fname = entry.fileName;
	labels = entry.labels;
	var photoBox = document.createElement("div");
	photoBox.className = "photoBox";
	photoBox.id = "photoBox " + id;

	// contains the image and the hamburger buttons
	var photoBoxOptions = document.createElement("div");
	photoBoxOptions.className = "photoBoxOptions"
	photoBox.appendChild(photoBoxOptions);

	// The actual image and its attributes
	var photo = document.createElement("img");
	photo.className = "photo";
	photo.src = "./photo/" + fname;
	photoBoxOptions.appendChild(photo);

	// appened the menus
	appendClosedHam(photoBoxOptions, id);
	appendOpenHam(photoBoxOptions, id);

	// contains the tag box and other tag functions
	var tagOptions = document.createElement("div");
	tagOptions.className = "tagOptions";
	photoBox.appendChild(tagOptions);
	tagContainer(tagOptions, labels);
	appendLabelTextBox(tagOptions);
	appendAddButton(tagOptions);
	return photoBox;
}

function appendLabelTextBox(tagOptions) {
	var textBox = document.createElement("input");
	textBox.className = "labelTextBox";
	textBox.type = "text";
	tagOptions.appendChild(textBox);
}

function appendAddButton(tagOptions) {
	var someDiv = document.createElement("div");
	var buttonAdd = document.createElement("button");
	buttonAdd.onclick = "";
	buttonAdd.className = "addButton";
	buttonAdd.innerText = "Add";
	someDiv.appendChild(buttonAdd);
	tagOptions.appendChild(someDiv);
}

function tagContainer(tagOptions, labels){
  var labelsArr = labels.split(", ");
  var container = document.createElement("div");

  tagOptions.appendChild(container);

  container.className = "tagContainer";

  // For each label
  for(var i = 0; i < labelsArr.length; i++){
    var tag = labelsArr[i];
		console.log(tag);

    container.appendChild(newTag(tag));
  }
}

function newTag(tag) {
	var div = document.createElement("div");  // tags
	div.className = "tags";

	var img = document.createElement("img");  // delIcon
	img.className = "delIcon";
	img.src = "./photobooth/removeTagButton.png";

	var p = document.createElement("p");  // tag
	p.className = "tag";
	p.innerText = tag;


	img.onclick = function() {alert("Pressed X for " + tag);}

	div.appendChild(img);
	div.appendChild(p);

	return div;
}


// append the hamburger menu that go over the image
function appendClosedHam(photoBoxOptions, id) {
	var closedOptions = document.createElement("div");
	closedOptions.className = "closedOptions";
	closedOptions.id = "closedOptions-" + id;
	var input = document.createElement("input");
	input.type = "image";
	input.onclick = function () {toggleHamOn(id);};
	input.className = "hamburger";
	input.src = "./photobooth/optionsTriangle.png";
	closedOptions.appendChild(input);
	photoBoxOptions.appendChild(closedOptions);
}

// Toggle the full hamburger menu on
function toggleHamOn(id) {
	var open = document.getElementById('openOptions-' + id);
	var closed = document.getElementById('closedOptions-' + id);
	closed.style.display = 'none';
	open.style.display = 'inline-block';
}
// Toggle the full hamburger menu off
function toggleHamOff(id) {
	var open = document.getElementById('openOptions-' + id);
	var closed = document.getElementById('closedOptions-' + id);
	open.style.display = 'none';
	closed.style.display = 'inline-block';
}

// append the full hamburger menu
function appendOpenHam(photoBoxOptions, id) {
	var openOptions = document.createElement("div");
	openOptions.className = "openOptions";
	openOptions.id = "openOptions-" + id;
	var buttonTag = document.createElement("button");
	buttonTag.onclick = "";
	buttonTag.className = "buttonOptions";
	buttonTag.innerText = "change tags";

	var buttonFav = document.createElement("button");
	buttonFav.onclick = "";
	buttonFav.className = "buttonOptions";
	buttonFav.innerText = "add to favorites";

	var burger = document.createElement("div");
	burger.className = "burger";

	var input = document.createElement("input");
	input.type = "image";
	input.onclick = function () {toggleHamOff(id);};
	input.className = "hamburger";
	input.src = "./photobooth/optionsTriangle.png";

	openOptions.appendChild(buttonTag);
	openOptions.appendChild(buttonFav);
	burger.appendChild(input);
	openOptions.appendChild(burger);
	photoBoxOptions.appendChild(openOptions);
}

function dumpDB2(){
	// Send a request to dump
	var urlToDumpDB = url + "/query?op=dump";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", urlToDumpDB);
	oReq.onload = function() {
		console.log("try processing");
		var DBphotos = JSON.parse(oReq.responseText);
		var photoMain = document.getElementById("photoMain");
		for (i = 0; i < DBphotos.length; i++) {
			console.log(DBphotos[i]);
			photoMain.appendChild(createPhotoBox(DBphotos[i], i));
		}
	}
	oReq.send();
}


// Dump all files in the database onto the browser
function dumpDB(){
    // Send a request to dump
    var urlToDumpDB = url + "/query?op=dump";
    var dumpReq = new XMLHttpRequest();
    dumpReq.open("GET", urlToDumpDB);

    dumpReq.onload = function(){
        console.log(JSON.parse(dumpReq.responseText));
        var DBphotos = JSON.parse(dumpReq.responseText);

        // Very similar to uploadFile():
        var photosContainer = document.getElementById("photosContainer");

        // For each image, display image
        for(var i = 0; i < DBphotos.length; i++){
            console.log(DBphotos[i]);

            var fileName = DBphotos[i].fileName;
            var labelsObj = DBphotos[i].labels;
            var labelsAry = labelsObj.split(",");  // Split labels by ,

            var photoBox = document.createElement("div");
            var img = document.createElement("img");
            var labels = document.createElement("ul");
            var input = document.createElement("input");
            var addBtn = document.createElement("button");

            photoBox.appendChild(img);
            photoBox.appendChild(labels);
            photoBox.appendChild(input);
            photoBox.appendChild(addBtn);
            photosContainer.appendChild(photoBox);

            // Image attributes
            img.id = fileName + "Img";
            img.className = "photo";
            img.src = "./photo/" + fileName;

            // Labels
            labels.id = fileName + "Labels";

            // Input
            input.type = "text";
            input.id = fileName+ "Input";

            // Add label button
            addBtn.innerHTML = "add";

            // For each label, display label
            for(var j = 0; j < labelsAry.length; j++){
                if(labelsAry[j] !== ""){
                    // Append label to list of labels
                    var li = document.createElement("li");
                    var label = document.createTextNode(labelsAry[j]);

                    li.appendChild(label);  // Append text to li
                    labels.appendChild(li);  // Append li to list of labels

                    // Delete label
                    li.onclick = function(){
                        // Send request to delete label
                        var urlToDelete = url + "/query?op=delete&img=" + fileName + "&label=" + li.textContent;
                        var delReq = new XMLHttpRequest();
                        delReq.open("GET", urlToDelete);

                        delReq.onload = function(){
                            // When deleting label is complete, send another request to get labels to display
                            console.log(delReq.responseText);
                            var urlToDisplay = url + "/query?op=getLabels&img=" + fileName;
                            var displayReq = new XMLHttpRequest();
                            displayReq.open("GET", urlToDisplay);
                            displayReq.onload = function(){
                                console.log(JSON.parse(displayReq.responseText));
                                li.parentNode.removeChild(li);  // Remove li from list
                            };
                            displayReq.send();
                        };

                        delReq.send();
                    };
                }
            }



            // Adding labels
            addBtn.onclick = function(){
                // Send request to add label
                        var label = checkLabel(input.value);
                        // don't do anything if the label is undefined
                        if (label == undefined) {
                            return;
                        }
                var urlToAdd = url + "/query?op=add&img=" + fileName + "&label=" + label;
                var addReq = new XMLHttpRequest();
                addReq.open("GET", urlToAdd);

                addReq.onload = function() {  // equivalent to adding a listener for “load” which occurs when transfer is complete
                    // When adding label is complete, send another request to get labels to display
                    console.log(addReq.responseText);

                    var urlToDisplay = url + "/query?op=getLabels&img=" + fileName;
                    var displayReq = new XMLHttpRequest();
                    displayReq.open("GET", urlToDisplay);

                    displayReq.onload = function() {
                        // Append to list and display labels
                        console.log(JSON.parse(displayReq.responseText));
                        var labelsObj = JSON.parse(displayReq.responseText);  // Parse string to be JSON object
                        var labelsAry = labelsObj.labels.split(",");
                        var li = document.createElement("li");
                        // var X = document.createElement("img");
                        var label = document.createTextNode(labelsAry[labelsAry.length-1]);  // Get the last label (most recently added)

                        // li.appendChild(X);
                        li.appendChild(label);  // Append text to li
                        labels.appendChild(li);  // Append li to list of labels

                        // Delete label
                        li.onclick = function(){
                            // Send request to delete label
                            var urlToDelete = url + "/query?op=delete&img=" + fileName + "&label=" + li.textContent;
                            var delReq = new XMLHttpRequest();
                            delReq.open("GET", urlToDelete);

                            delReq.onload = function(){
                                // When deleting label is complete, send another request to get labels to display
                                console.log(delReq.responseText);
                                displayReq.open("GET", urlToDisplay);
                                displayReq.onload = function(){
                                    console.log(JSON.parse(displayReq.responseText));
                                    li.parentNode.removeChild(li);  // Remove li from list
                                };
                                displayReq.send();
                            };

                            delReq.send();
                        };
                    };

                    displayReq.send();
                };

                addReq.send();
            };
        }

    }
    dumpReq.send();
}


function uploadFile(){
    var selectedFile = document.getElementById("fileSelector").files[0];  // Take the first file

    // Create new form and put file inside
    var formData = new FormData();
    formData.append("userfile", selectedFile);


    // Create new image tag and append to photos container
    var photosContainer = document.getElementById("photosContainer");
    var photoBox = document.createElement("div");
    var img = document.createElement("img");
    var labels = document.createElement("ul");
    var input = document.createElement("input");
    var addBtn = document.createElement("button");

    photoBox.appendChild(img);
    photoBox.appendChild(labels);
    photoBox.appendChild(input);
    photoBox.appendChild(addBtn);
    photosContainer.appendChild(photoBox);

    // Image attributes
    img.id = selectedFile.name + "Img";
    img.className = "photo";
    // Labels
    labels.id = selectedFile.name + "Labels";
    // Input
    input.type = "text";
    input.id = selectedFile.name + "Input";

    // Add label button
    addBtn.innerHTML = "add";

    // Display image by using a FileReader
    var fr = new FileReader();
    fr.onload = function () {  // Anonymous callback uses file as image source
        img.src = fr.result;
    };
    fr.readAsDataURL(selectedFile);  // Begin reading
    img.style.opacity = 0.5;  // Fade image


    // Put into database, Make a request and send form over as a POST request
    var oReq = new XMLHttpRequest();
    oReq.open("POST", url);
    oReq.onload = function() {  // equivalent to adding a listener for “load” which occurs when transfer is complete
        // console.log(oReq.responseText);
        // Display labels
    }
    oReq.send(formData);

    // Adding labels
    addBtn.onclick = function(){
        // Send request to add label
				var label = checkLabel(input.value);
				// don't do anything if the label is undefined
				if (label == undefined) {
					return;
				}
        var urlToAdd = url + "/query?op=add&img=" + selectedFile.name + "&label=" + label;
        var addReq = new XMLHttpRequest();
        addReq.open("GET", urlToAdd);

        addReq.onload = function() {  // equivalent to adding a listener for “load” which occurs when transfer is complete
            // When adding label is complete, send another request to get labels to display
            console.log(addReq.responseText);

            var urlToDisplay = url + "/query?op=getLabels&img=" + selectedFile.name;
            var displayReq = new XMLHttpRequest();
            displayReq.open("GET", urlToDisplay);

            displayReq.onload = function() {
                // Append to list and display labels
                console.log(JSON.parse(displayReq.responseText));
                var labelsObj = JSON.parse(displayReq.responseText);  // Parse string to be JSON object
                var labelsAry = labelsObj.labels.split(",");
                var li = document.createElement("li");
                // var X = document.createElement("img");
                var label = document.createTextNode(labelsAry[labelsAry.length-1]);  // Get the last label (most recently added)

                // li.appendChild(X);
                li.appendChild(label);  // Append text to li
                labels.appendChild(li);  // Append li to list of labels

                // Delete label
                li.onclick = function(){
                    // Send request to delete label
                    var urlToDelete = url + "/query?op=delete&img=" + selectedFile.name + "&label=" + li.textContent;
                    var delReq = new XMLHttpRequest();
                    delReq.open("GET", urlToDelete);

                    delReq.onload = function(){
                        // When deleting label is complete, send another request to get labels to display
                        console.log(delReq.responseText);
                        displayReq.open("GET", urlToDisplay);
                        displayReq.onload = function(){
                            console.log(JSON.parse(displayReq.responseText));
                            li.parentNode.removeChild(li);  // Remove li from list
                        };
                        displayReq.send();
                    };

                    delReq.send();
                }
            };

            displayReq.send();
        };

        addReq.send();
    };

}
