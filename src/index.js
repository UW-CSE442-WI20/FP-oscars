(function() {
	const female = require("./SVG/female.svg");
	const femalePink = require("./SVG/female-pink.svg");
	const male = require("./SVG/male.svg");
	const maleBlue = require("./SVG/male-blue.svg");

	// Make sure the window has loaded before we start trying to 
	// modify the DOM.
	window.addEventListener("load", init);

	function init() {
		// TODO make the color stay when the user clicks on it
		id("female").addEventListener("mouseover", changeToPink); 	
		id("female").addEventListener("mouseout", changeBack); 
		id("female").addEventListener("click", changeToPink); 
		id("male").addEventListener("mouseover", changeToBlue); 	
		id("male").addEventListener("mouseout", changeBackToMale); 
		id("male").addEventListener("click", changeToBlue); 	
	}

	function changeToPink() {
		id("female-icon").src = femalePink; 
	}

	function changeBack() {
		id("female-icon").src = female;
	}

	function changeToBlue() {
		id("male-icon").src = maleBlue; 
	}

	function changeBackToMale() {
		id("male-icon").src = male;
	}

	function id(idName) {
 		return document.getElementById(idName);
	}

	function qsa(query) {
		return document.querySelectorAll(query);
	}

	function qs(query) {
		return document.querySelector(query);
	}
})();
