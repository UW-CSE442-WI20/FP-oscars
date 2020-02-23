(function() {
	const female = require("./SVG/female.svg");
	const femalePink = require("./SVG/female-pink.svg");
	const male = require("./SVG/male.svg");
	const maleBlue = require("./SVG/male-blue.svg");
	const noUiSlider = require("nouislider");
	let femaleIconSelected = false;
	let maleIconSelected = false;

	// Make sure the window has loaded before we start trying to 
	// modify the DOM.
	window.addEventListener("load", init);

	function init() {
		// TODO make the color stay when the user clicks on it
		id("female").addEventListener("mouseover", changeToPink); 	
		id("female").addEventListener("mouseout", changeBack); 
		id("female").addEventListener("click", clickFemale); 
		id("male").addEventListener("mouseover", changeToBlue); 	
		id("male").addEventListener("mouseout", changeBackToMale); 
		id("male").addEventListener("click", clickMale); 
		makeSlider();	
	}

	function makeSlider() {
		let slider = id('slider');
		let range_all_sliders = {
			'min': [     0 ],
			'10%': [   500,  500 ],
			'50%': [  4000, 1000 ],
			'max': [ 10000 ]
		};
		noUiSlider.create(slider, {
		    start: [50],
		    connect: [true, true],
		    range: {
		        'min': 0,
		        '5%': 5,
		        '10%': 10,
		        '15%': 15,
		        '20%': 20,
		        '25%': 25,
		        '30%': 30,
		        '35%': 35,
		        '40%': 40,
		        '45%': 45,
		        '50%': 50,
		        '55%': 55,
		        '60%': 60,
		        '65%': 65,
		        '70%': 70,
		        '75%': 75,
		        '80%': 80,
		        '85%': 85,
		        '90%': 90,
		        '95%': 95,
		        'max': 100
		    },
		    snap: true,
		    pips: {
		        mode: 'positions',
		        values: [0, 25, 50, 75, 100],
		        density: 4
		    }
		});
		let connect = slider.querySelectorAll('.noUi-connect');
		let classes = ['c-1-color', 'c-2-color'];

		for (let i = 0; i < connect.length; i++) {
		    connect[i].classList.add(classes[i]);
		}

		slider.noUiSlider.on('update', function () {
	        let value = slider.noUiSlider.get();
	        id("gender-percent").innerText = value + "%";
	    });
	}

	function clickFemale() {
		femaleIconSelected = true;
		id("female-icon").src = femalePink; 
		id("male-icon").src = male;
		id("female").style.textDecoration = "underline solid black";
		id("male").style.textDecoration = "none";
	}

	function changeToPink() {
		id("female-icon").src = femalePink; 
	}

	function changeBack() {
		if (!femaleIconSelected) {
			id("female-icon").src = female;
		}
	}

	function clickMale() {
		maleIconSelected = true;
		id("male-icon").src = maleBlue;
		id("female-icon").src = female;
		id("male").style.textDecoration = "underline solid black"; 
		id("female").style.textDecoration = "none";

	}

	function changeToBlue() {
		id("male-icon").src = maleBlue; 
	}

	function changeBackToMale() {
		if (!maleIconSelected) {
			id("male-icon").src = male;
		}
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
