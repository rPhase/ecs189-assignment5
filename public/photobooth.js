
function readUploadFile() {
	// Read the file and display it first
	var selectedFile = document.getElementById('fileSelector').files[0];
  var image = document.getElementById('theImage');
  var fr = new FileReader();
  // anonymous callback uses file as image source
  fr.onload = function () {
		image.src = fr.result;
  };
  fr.readAsDataURL(selectedFile);    // begin reading
	image.style.opacity = 0.5;

	// Upload the file
	var url = "http://138.68.25.50:10298";
	var formData = new FormData();
	// stick the file into the form
	formData.append("userfile", selectedFile);
	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);
	oReq.onload = function() {
		// the response, in case we want to look at it
		console.log(oReq.responseText);
	}
	oReq.send(formData);
}

function changeLabel(op) {
	var start = "http://138.68.25.50:10298/change?img=";
	var imgName = "eagle.jpg"
	var label = document.getElementById('labelBox').value;
	// remove leading and trailing whitespace and URL encode the label
	label = label.replace(/\s+/g, ' ').trim();
	label = encodeURIComponent(label);
	if (label) {
		var opString = "&op=" + op;
		var url = start + imgName + "&label=" +label + opString;
		console.log(url);
	} else {
		alert("Invalid Label.");
		return;
	}

	function reqListener () {
		var pgh = document.getElementById("status");
		pgh.textContent = this.responseText;
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();
}
