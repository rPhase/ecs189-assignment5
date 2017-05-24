


function checkLabel(label) {
	// remove leading and trailing whitespace and URL encode the label
	label = label.replace(/\s+/g, ' ').trim();
	label = encodeURIComponent(label);
	if (label) {
		return label;
	} else {
		alert("Invalid Label.");
		return undefined;
	}
}

function uploadFile(){
    // var url = "http://138.68.25.50:10298";
    var url = "http://localhost:10298";

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
        var urlToAdd = "http://localhost:10298/query?op=add&img=" + selectedFile.name + "&label=" + label;
        var addReq = new XMLHttpRequest();
        addReq.open("GET", urlToAdd);

        addReq.onload = function() {  // equivalent to adding a listener for “load” which occurs when transfer is complete
            // When adding label is complete, send another request to get labels to display
            console.log(addReq.responseText);

            var urlToDisplay = "http://localhost:10298/query?op=getLabels&img=" + selectedFile.name;
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
                    var urlToDelete = "http://localhost:10298/query?op=delete&img=" + selectedFile.name + "&label=" + li.textContent;
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