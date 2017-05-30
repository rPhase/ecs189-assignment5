// var url = "http://138.68.25.50:10298";
var url = "http://localhost:10298";
var numPhoto;
dumpDB2();


// Dump all images from the database onto the browser
function dumpDB2(){
	// Send a request to dump
	var urlToDumpDB = url + "/query?op=dump";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", urlToDumpDB);

	// When response comes back, 
	oReq.onload = function() {
		console.log("try processing");
		// Parse json response
		var DBphotos = JSON.parse(oReq.responseText);
		numPhoto = DBphotos.length;

		// For each photo in the DB, create a new photo box and append to the main photo container
		var photoMain = document.getElementById("photoMain");
		for (i = 0; i < DBphotos.length; i++) {
			console.log(DBphotos[i]);
			photoMain.appendChild(createPhotoBox(DBphotos[i], i));
		}
	}
	oReq.send();  // Send request
}


// Upload selected file and display image
function readUploadFile() {
	// Select the file
	var selectedFile = document.getElementById('fileSelector').files[0];
	console.log(selectedFile.name);
  	// var image = document.getElementById('theImage');

  	// Use FileReader to read the selected file
  	var fr = new FileReader();
  	// anonymous callback uses file as image source
  	fr.onload = function () {
		// image.src = fr.result;
		var imgObj = {
			fileName: selectedFile.name,
			labels: ""
		}
		numPhoto = numPhoto + 1;

		// Create a new photo box and append to the main photo container
		var photoMain = document.getElementById("photoMain");
		photoMain.appendChild(createPhotoBox(imgObj, numPhoto));

  	};
  	fr.readAsDataURL(selectedFile);  // Begin reading file
	// image.style.opacity = 0.5;

	// Use FormData to send file over to insert into database
	var formData = new FormData();
	formData.append("userfile", selectedFile);  // stick the file into the form

	// Send a POST request to upload file to database
	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);

	// When a response comes back,
	oReq.onload = function() {
		// var imgObj = {
		// 	fileName: selectedFile.name,
		// 	labels: ""
		// }
		// numPhoto = numPhoto + 1;
		// var photoMain = document.getElementById("photoMain");
		// photoMain.appendChild(createPhotoBox(imgObj, numPhoto));
	}
	oReq.send(formData);  // Send request
}


// Create a photoBox container that contains the options (hamburger menu), image, and tags (labels)
function createPhotoBox(entry, id) {
	fname = entry.fileName;
	labels = entry.labels;

	// Create photo box 
	var photoBox = document.createElement("div");
	photoBox.className = "photoBox";
	photoBox.id = "photoBox " + id;

	// Create options box and append to photo box; Contains the image and the hamburger buttons
	var photoBoxOptions = document.createElement("div");
	photoBoxOptions.className = "photoBoxOptions"
	photoBox.appendChild(photoBoxOptions);

	// Create image and append to options box; The actual image and its attributes
	var photo = document.createElement("img");
	photo.className = "photo";
	photo.src = "./photo/" + fname;
	photoBoxOptions.appendChild(photo);

	// Appened both open and closed options box (hamburger menu)
	appendClosedHam(photoBoxOptions, id);
	appendOpenHam(photoBoxOptions, id);

	// Create tags box (which has tags, text box, and add button) and append to photo box
	var tagOptions = document.createElement("div");
	tagOptions.className = "tagOptions";
	photoBox.appendChild(tagOptions);

	// Append tags, text box, and add button to tags box; contains the tag box and other tag functions
	tagContainer(tagOptions, labels, fname, id);
	appendLabelTextBox(tagOptions, id);
	appendAddButton(tagOptions, fname, id);
	return photoBox;
}


// append the closed hamburger menu that go over the image
function appendClosedHam(photoBoxOptions, id) {
	// Create div for close hamburger menu
	var closedOptions = document.createElement("div");
	closedOptions.className = "closedOptions";
	closedOptions.id = "closedOptions-" + id;

	// Create input, which is an image (closed hamburger image)
	var input = document.createElement("input");
	input.type = "image";
	input.className = "hamburger";
	input.src = "./photobooth/optionsTriangle.png";

	// Append input to options box
	closedOptions.appendChild(input);
	photoBoxOptions.appendChild(closedOptions);

	// When the closed hamburger menu is clicked, open menu
	input.onclick = function () {toggleHamOn(id);};
}


// append the opened hamburger menu
function appendOpenHam(photoBoxOptions, id) {
	// Create div for open hamburger menu and option buttons
	var openOptions = document.createElement("div");
	openOptions.className = "openOptions";
	openOptions.id = "openOptions-" + id;

	// Create change tags button
	var buttonTag = document.createElement("button");
	buttonTag.onclick = "";
	buttonTag.className = "buttonOptions";
	buttonTag.innerText = "change tags";

	// Create favorites button
	var buttonFav = document.createElement("button");
	buttonFav.onclick = "";
	buttonFav.className = "buttonOptions";
	buttonFav.innerText = "add to favorites";

	// Create input, which is an image (hamburger image)
	var input = document.createElement("input");
	input.type = "image";
	input.className = "hamburger";
	input.src = "./photobooth/optionsTriangle.png";
	
	// Create div for input (hamburger image)
	var burger = document.createElement("div");
	burger.className = "burger";

	// Append input into div
	burger.appendChild(input);

	// Append change tags button, favorites button, and hamburger menu to options box
	openOptions.appendChild(buttonTag);
	openOptions.appendChild(buttonFav);
	openOptions.appendChild(burger);
	photoBoxOptions.appendChild(openOptions);

	// When the hamburger menu is clicked, close menu
	input.onclick = function () {toggleHamOff(id);};
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


// Append tags into tags box
function tagContainer(tagOptions, labels, fname, id){
	// Array of tags/labels
  	var labelsArr = labels.split(", ");

  	// Create div for tags and append to tags box
  	var container = document.createElement("div");
  	container.className = "tagContainer";
	container.id = "tagContainer-"+id;
	tagOptions.appendChild(container);

  	// For each tag
	console.log("length:"+labelsArr.length);
  	for(var i = 0; i < labelsArr.length; i++){
    	var tag = labelsArr[i];
		console.log(tag);
		// Create tag and append tag to tags div
		if (tag!=""){
			container.appendChild(newTag(tag, fname));
		}
  	}
}


// Create tag with delete icon and text
function newTag(tag, fname) {
	// Create div for delete icon and text
	var div = document.createElement("div");  // tags
	div.className = "tags";

	// Create image, which is the delete icon
	var img = document.createElement("img");  // delIcon
	img.className = "delIcon";
	img.src = "./photobooth/removeTagButton.png";
	
	// Create text
	var p = document.createElement("p");  // tag
	p.className = "tag";
	p.innerText = tag;

	// Append delete icon and text to div
	div.appendChild(img);
	div.appendChild(p);

	// When the delete icon is clicked, delete tag
	img.onclick = function() {deleteLabelDB(fname, tag, div);}

	return div;
}


// Append tag text box into tags box
function appendLabelTextBox(tagOptions, id) {
	// Create input, which is a text and append
	var textBox = document.createElement("input");
	textBox.className = "labelTextBox";
	textBox.id = "labelTextBox-"+id;
	textBox.type = "text";
	tagOptions.appendChild(textBox);
}


// Append add tag button into tags box
function appendAddButton(tagOptions, fname, id) {
	// Create add button and append
	var someDiv = document.createElement("div");
	var buttonAdd = document.createElement("button");
	buttonAdd.className = "addButton";
	buttonAdd.innerText = "Add";
	someDiv.appendChild(buttonAdd);
	tagOptions.appendChild(someDiv);

	// When add button is clicked, add tag
	buttonAdd.onclick = function() {addLabelDB(fname, id);}
}


// Add tag to database
function addLabelDB(imgName, id) {
	var start = "/query?img=";

	// Get tag from text box, remove leading and trailing whitespace, and URL encode the label
	var label = document.getElementById('labelTextBox-'+id).value;
	label = label.replace(/\s+/g, ' ').trim();
	label = encodeURIComponent(label);

	if (label) {
		// URL to make a request to add tag
		var opString = "&op=add";
		var new_url = url + start + imgName + "&label=" +label + opString;
		console.log(new_url);
	} else {
		alert("Invalid Label.");
		return;
	}

	// Callback function when a response comes back
	function reqListener () {
		// TODO check for proper deletion from db
		alert(this.responseText);
		// Create tag and append to tags div
		var container = document.getElementById("tagContainer-"+id);
		container.appendChild(newTag(label, imgName));
	}

	// Send a GET request to add tag
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", new_url);
	oReq.send();
}


// Delete tag from database
function deleteLabelDB(imgName, label, div) {
	var start = "/query?img=";

	// Remove leading and trailing whitespace and URL encode the label
	label = label.replace(/\s+/g, ' ').trim();
	label = encodeURIComponent(label);

	if (label) {
		// URL to make a request to delete tag
		var opString = "&op=delete";
		var new_url = url + start + imgName + "&label=" +label + opString;
		console.log(new_url);
	} else {
		alert("Invalid Label.");
		return;
	}

	// Callback function when a response comes back
	function reqListener () {
		// TODO check for proper deletion from db
		alert(this.responseText);
		// Remove tag from tags div
		div.parentNode.removeChild(div);
	}

	// Send a GET request to delete tag
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", new_url);
	oReq.send();
}


// Filter photos; Show the photo boxes that have a tag that matches and hide the ones that doesn't
function filterPhotos(){
	var photoMain = document.getElementById("photoMain");
	var photoBoxes = photoMain.getElementsByClassName("photoBox");
	var input = document.getElementById("filterInput");
	console.log("FILTER" + input.value);
	
	// For each photo box
	for(var i = 0; i < photoBoxes.length; i++){
		// Hide all photo boxes; Don't display any photo boxes yet
		photoBoxes[i].style.display = "none";  

		// Get all tags in each photo box
		var tags = photoBoxes[i].getElementsByClassName("tag");
		
		// For each tag in the photo box
		for(var j = 0; j < tags.length; j++){
			// Make it lowercase to filter easily
			tags[j].innerHTML = tags[j].innerHTML.toLowerCase();
			input.value = input.value.toLowerCase();

			// If a tag matches the filter input, display photo box
			if(tags[j].innerHTML === input.value){
				photoBoxes[i].style.display = "inline";
				break;
			}
		}
		
	}
}


// Toggle upload and filter button to open and close
function toggleSidebar(option) {
  	var acc = document.getElementById(option);
  	/* Toggle between hiding and showing the active panel */

  	if (acc.style.display === "block") {
    	acc.style.display = "none";
  	} else {
    	acc.style.display = "block";
  	}	
}







// Check label; 
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
