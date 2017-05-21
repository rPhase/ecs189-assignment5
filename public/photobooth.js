
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

function fadeImage() {
  var image = document.getElementById('theImage');
  var button = document.getElementById('fadeButton');
  if (button.textContent == 'Fade') {
		image.style.opacity = 0.5;
		button.textContent = 'UnFade';
  } else {
		image.style.opacity = 1.0;
		button.textContent = 'Fade';
  }
}
