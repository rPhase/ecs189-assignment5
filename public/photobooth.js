var port = 10298; // Ryan's
// var port = 12520; // Lanh's
// var url = "http://localhost:"+port;
var url = "http://138.68.25.50:"+port;

var numPhoto;
dumpDB();

// When the enter button on the splash page is clicked, enter the photobooth app
function enterApp(){
	// Change the href to enter the app and display all photos from the database
	window.location.href = url + "/photobooth.html";
}


// Dump all images from the database onto the browser
function dumpDB(){
	// Send a request to dump
	var urlToDumpDB = url + "/query?op=dump";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", urlToDumpDB);

	// When response comes back,
	oReq.onload = function() {
		// console.log("try processing");

		// Parse json response
		var DBphotos = JSON.parse(oReq.responseText);
		numPhoto = DBphotos.length;

		// For each photo in the DB, create a new photo box and append to the main photo container
		var photoMain = document.getElementById("photoMain");
		for (i = 0; i < DBphotos.length; i++) {
			// console.log(DBphotos[i]);
			var newBox = createPhotoBox(DBphotos[i], i);
			if (photoMain.firstElementChild == null){
				photoMain.appendChild(newBox);
			} else {
				photoMain.insertBefore(newBox, photoMain.firstElementChild);
			}
		}
	}
	oReq.send();  // Send request
}


// Change filename display when a file is selected
function updateFilename(type){
	if (type === "mobile") {
		var selectedFile = document.getElementById('fileSelector-mobile').files[0];
		var filename_mobile = document.getElementById("fileName-mobile");
		filename_mobile.innerHTML = selectedFile.name;
	} else {
		var selectedFile = document.getElementById('fileSelector').files[0];
		var filename = document.getElementById("fileName");
		filename.innerHTML = selectedFile.name;
	}
}

// Upload selected file and display image
function readUploadFile(type) {
	// Select the file
	if (type === "mobile") {
		var selectedFile = document.getElementById('fileSelector-mobile').files[0];
		var filename = document.getElementById("fileName-mobile");
	} else {
		var selectedFile = document.getElementById('fileSelector').files[0];
		var filename = document.getElementById("fileName");
	}
	if (filename.innerHTML == "no file selected") {
		alert("No file selected");
		return;
	}
	// Reset file name
	filename.innerHTML = "no file selected";
	var checkURL = url + "/query?img="+selectedFile.name+"&op=exists";
	// Send a GET request to check for file
	var xReq = new XMLHttpRequest();
	xReq.addEventListener("load", reqListener);
	xReq.open("GET", checkURL);
	function reqListener() {
		if (xReq.status == 500) {
			alert(xReq.responseText);
			// alert("ERROR: Duplicate file");
		} else {
			var imgObj = { filename: "", labels: "", favorite: 0 };
			var photoMain = document.getElementById("photoMain");
			var tempPhotoBox = document.createElement("div");

			// Use FileReader to read the selected file
			var fr = new FileReader();

			// When reading file is finished, display faded image and upload bar
			fr.onload = function () {
				imgObj.fileName = selectedFile.name;

				// Display faded imaged while it is uploading
				var image = document.createElement("img");
				image.src = fr.result;
				image.className = "photo";
				image.style.opacity = 0.5;
				tempPhotoBox.className = "photoBox";

				// Create upload bar
				var progressOuter = document.createElement('div');
				var progress = document.createElement('div');
				progressOuter.appendChild(progress);
				progressOuter.id = "progressOuter";
				progress.id = "progress";

				// Append
				tempPhotoBox.appendChild(image);
				tempPhotoBox.appendChild(progressOuter);
				photoMain.appendChild(tempPhotoBox);
				if (photoMain.firstElementChild == null){
					photoMain.appendChild(tempPhotoBox);
				} else {
					photoMain.insertBefore(tempPhotoBox, photoMain.firstElementChild);
				}


			};
			fr.readAsDataURL(selectedFile);  // Begin reading file

			// Use FormData to send file over to insert into database
			var formData = new FormData();
			formData.append("userfile", selectedFile);  // stick the file into the form

			// Send a POST request to upload file to database
			var oReq = new XMLHttpRequest();
			oReq.open("POST", url, true);


			// While uploading, display upload progress bar
		    oReq.upload.addEventListener('progress', function(e){
		    	var progressBar = document.getElementById("progress");
		    	// Compute percent done and set progress bar width to percent done
		    	if (e.lengthComputable) {
			   		var progress = (e.loaded/e.total) * 100;
		        	progressBar.style.width =  progress + '%';
			    }

		    }, false);


			// When a response comes back, delete faded image, create a photo box, add tags from API
			oReq.onload = function() {
				// Parse API object (contains tags)
				var APILabels = JSON.parse(this.responseText);
				for(var i = 0; i < APILabels.length; i++){
					imgObj.labels += APILabels[i].description + ", ";
					// console.log(APILabels[i].description);
				}

				// Delete faded image
				tempPhotoBox.parentNode.removeChild(tempPhotoBox);

				// Create a new photo box and append to the main photo container
				numPhoto = numPhoto + 1;
				var newBox = createPhotoBox(imgObj, numPhoto);
				// photoMain.appendChild(createPhotoBox(imgObj, numPhoto));
				if (photoMain.firstElementChild == null){
					photoMain.appendChild(newBox);
				} else {
					photoMain.insertBefore(newBox, photoMain.firstElementChild);
				}
			}
			oReq.send(formData);  // Send request
		}
	};
	xReq.send();
}


// Create a photoBox container that contains the options (hamburger menu), image, and tags (labels)
function createPhotoBox(entry, id) {
	fname = entry.fileName;
	labels = entry.labels;
	fav = entry.favorite;

	// Create photo box
	var photoBox = document.createElement("div");
	photoBox.className = "photoBox";
	photoBox.id = "photoBox-" + id;

	// Create options box and append to photo box; Contains the image and the hamburger buttons
	var photoBoxOptions = document.createElement("div");
	photoBoxOptions.className = "photoBoxOptions"
	photoBox.appendChild(photoBoxOptions);

	// Create image and append to options box; The actual image and its attributes
	var photo = document.createElement("img");
	photo.className = "photo";
	photo.src = "./photo/" + fname;
	photoBoxOptions.appendChild(photo);

	var wrapper = document.createElement("div");
	wrapper.className = "wrapper";
	photoBoxOptions.appendChild(wrapper);
	// Appened both open and closed options box (hamburger menus)
	appendClosedHam(wrapper, id);
	appendOpenHam(wrapper, fname, id, fav);

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
function appendOpenHam(photoBoxOptions, fname, id, fav) {
	// Create div for open hamburger menu and option buttons
	var openOptions = document.createElement("div");
	openOptions.className = "openOptions";
	openOptions.id = "openOptions-" + id;

	// Create change tags button
	var buttonTag = document.createElement("button");
	buttonTag.onclick = function() {toggleTags(id);};
	buttonTag.className = "buttonOptions";
	buttonTag.innerText = "change tags";

	// Create favorites button
	var buttonFav = document.createElement("button");
	buttonFav.onclick = function () {toggleFavorite(fname, id);};
	buttonFav.className = "buttonOptions";
	buttonFav.id = "buttonFav-" + id;
	if (fav == 0) {
		buttonFav.innerText = "add to favorites";
	} else {
		buttonFav.innerText = "unfavorite";
	}

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


function toggleTags(id) {
	var container = document.getElementById('tagContainer-'+id);
	var textBox = document.getElementById('labelTextBox-'+id);
	var button = document.getElementById('addButton-'+id);

	// if change tags is off
	if (button.style.display == "") {
		// show the change tag options
		container.style.backgroundColor = "#ba9a8a";
		for (var i = 0; i < container.children.length; i++) {
			// spacer
			container.children[i].children[0].style.width="0px";
			// button
			container.children[i].children[1].style.display = "inline";
		}
		container.style.borderBottom = "0px";
		textBox.style.display = 'inline';
		button.style.display = 'inline';
	} else {
		// hide the change tag options
		container.style.backgroundColor = "";
		for (var i = 0; i < container.children.length; i++) {
			// spacer
			container.children[i].children[0].style.width = "18px";
			// button
			container.children[i].children[1].style.display = "";
		}
		container.style.borderBottom = "2px solid";
		textBox.style.display = "";
		button.style.display = "";
	}
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
	for(var i = 0; i < labelsArr.length; i++){
  	var tag = labelsArr[i];
		// Create tag and append tag to tags div
		if (tag!=""){
			var someTag = newTag(tag, fname);
			someTag.children[0].style.width = "18px";
			someTag.children[1].style.display = "";
			container.appendChild(someTag);
		}
	}
}


// Create tag with delete icon and text
function newTag(tag, fname) {
	// Create div for delete icon and text
	var div = document.createElement("div");  // tags
	div.className = "tags";

	// Add a spacer in place of button
	var spacer = document.createElement("div");
	spacer.className = 'spacer';
	spacer.style.width = "0px";

	// Create image, which is the delete icon
	var img = document.createElement("img");  // delIcon
	img.className = "delIcon";
	img.src = "./photobooth/removeTagButton.png";
	img.style.display = "inline";

	// Create text
	var p = document.createElement("p");  // tag
	p.className = "tag";
	p.innerText = tag;

	// Append delete icon and text to div
	div.appendChild(spacer);
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
	buttonAdd.id = "addButton-" + id;
	buttonAdd.innerText = "Add";
	someDiv.appendChild(buttonAdd);
	tagOptions.appendChild(someDiv);

	// When add button is clicked, add tag
	buttonAdd.onclick = function() {addLabelDB(fname, id);}
}

function toggleFavorite(fname, id) {
	var button = document.getElementById('buttonFav-'+id);

	// create the proper query url to set the favorite
	if (button.textContent == 'add to favorites') {
		var new_url = url + "/query?img=" + fname + "&op=favorite";
	} else {
		var new_url = url + "/query?img=" + fname + "&op=unfavorite";
	}

	// Callback function when a response comes back
	function reqListener () {
		if (this.status != 200) {
			alert(this.responseText);
		} else {
			if (button.textContent == 'add to favorites') {
				button.textContent = 'unfavorite';
			} else {
				button.textContent = 'add to favorites';
			}
		}
	}

	// Send a GET request to set favorite
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", new_url);
	oReq.send();
}

// Add tag to database
function addLabelDB(imgName, id) {
	var start = "/query?img=";

	// Get tag from text box, remove leading and trailing whitespace, and URL encode the label
	var label = document.getElementById('labelTextBox-'+id).value;
	label = label.replace(/\s+/g, ' ').trim().toLowerCase();
	var encode_label = encodeURIComponent(label);

	if (label) {
		// URL to make a request to add tag
		var opString = "&op=add";
		var new_url = url + start + imgName + "&label=" + encode_label + opString;
	} else {
		alert("Invalid Label.");
		return;
	}

	// Callback function when a response comes back
	function reqListener () {
		// Create tag and append to tags div
		if (this.status != 200) {
			alert(this.responseText);
		} else {
			var container = document.getElementById("tagContainer-"+id);
			container.appendChild(newTag(label, imgName));
		}
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
		// console.log(new_url);
	} else {
		alert("Invalid Label.");
		return;
	}

	// Callback function when a response comes back
	function reqListener () {
		if (this.status != 200) {
			alert(this.responseText);
		} else {
			// Remove tag from tags div
			div.parentNode.removeChild(div);
		}
	}

	// Send a GET request to delete tag
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", new_url);
	oReq.send();
}


// Filter photos; Show the photo boxes that have a tag that matches and hide the ones that doesn't
function filterPhotos(type){
	if (type === "mobile") {
		var input = document.getElementById("filterInput-mobile").value;
	} else {
		var input = document.getElementById("filterInput").value;
	}
	var photoMain = document.getElementById("photoMain");
	var photoBoxes = photoMain.getElementsByClassName("photoBox");
	// Remove leading and trailing whitespace and URL encode the label
	input = input.replace(/\s+/g, ' ').trim().toLowerCase();
	console.log("FILTER " + input);

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

			// If a tag matches the filter input, display photo box
			if(tags[j].innerHTML === input){
				photoBoxes[i].style.display = "inline";
				break;
			}
		}
	}
}

function showFavorites() {
	var photoMain = document.getElementById("photoMain");
	var photoBoxes = photoMain.getElementsByClassName("photoBox");
	var favorites = document.getElementById("favorites");

	if (favorites.style.color == "yellow") {
		clearFilter();
		favorites.style.color = ""
	} else {
		favorites.style.color = "yellow"
		// For each photo box
		for(var i = 0; i < photoBoxes.length; i++) {
			var button = photoBoxes[i].getElementsByClassName("buttonOptions")[1];
			if (button.textContent == 'unfavorite') {
				photoBoxes[i].style.display = "inline";
			}
			else {
				photoBoxes[i].style.display = "none";
			}
		}
	}
}

// Clear the filtering and display all the photos
function clearFilter(){
	var photoMain = document.getElementById("photoMain");
	var photoBoxes = photoMain.getElementsByClassName("photoBox");

	// For each photo box
	for(var i = 0; i < photoBoxes.length; i++){
		photoBoxes[i].style.display = "inline";
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

// Toggle upload and filter button to open and close for MOBILE
function toggleMobile(option) {
	var up = document.getElementById("upload-mobile");
	var fil = document.getElementById("filter-mobile");

	/* Toggle between hiding and showing the active panel */
	if (option === "upload-mobile") {
		fil.style.display = "none";
		var acc = up;
	} else {
		up.style.display = "none";
		var acc = fil;
	}

	if (acc.style.display === "block") {
  	acc.style.display = "none";
	} else {
  	acc.style.display = "block";
	}
}
