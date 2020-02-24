const d3 = require('d3');

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
		var elements = document.getElementsByClassName("flex-element");
		elements[0].addEventListener("click", function () { clickGenre(elements, 0)});
		elements[1].addEventListener("click", function () { clickGenre(elements, 1)});
		elements[2].addEventListener("click", function () { clickGenre(elements, 2)});
		elements[3].addEventListener("click", function () { clickGenre(elements, 3)});
		elements[4].addEventListener("click", function () { clickGenre(elements, 4)});
		elements[5].addEventListener("click", function () { clickGenre(elements, 5)});
		elements[6].addEventListener("click", function () { clickGenre(elements, 6)});
		elements[7].addEventListener("click", function () { clickGenre(elements, 7)});
		elements[8].addEventListener("click", function () { clickGenre(elements, 8)});
		// var elements = document.getElementsByClassName("flex-element");
		// for (var i = 0; i < elements.length; i++) {
		// 	var currElement = elements[i];
		// 	currElement.addEventListener("click", function () { clickGenre(currElement) });
		// }
		makeSlider();	
		makeCountryCarousel();
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
	        id("gender-percent").innerText = Math.round(value) + "%";
	    });
	}

	function makeCountryCarousel() {
	    let elem = id('flag-carousel');
		let flkty = new Flickity( elem, {
		  // options
		  contain: true,
		  wrapAround: true,
		  pageDots: false
		});
	}
	function clickGenre(elements, index) {
		console.log(elements[index].textContent);
	}
	function clickFemale() {
		if (maleIconSelected) {
			id("male").classList.toggle("underline");
		}
		if (id("female").classList.contains("underline")) {
			femaleIconSelected = false;
			id("female-icon").src = female; 
		} else {
			femaleIconSelected = true;
			maleIconSelected = false;
			id("female-icon").src = femalePink; 
		}
		id("male-icon").src = male;
		id("female").classList.toggle("underline");
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
		if (femaleIconSelected) {
			id("female").classList.toggle("underline");
		}
		if (id("male").classList.contains("underline")) {
			maleIconSelected = false;
			id("male-icon").src = male; 
		} else {
			maleIconSelected = true;
			femaleIconSelected = false;
			id("male-icon").src = maleBlue; 
		}
		id("female-icon").src = female;
		id("male").classList.toggle("underline");
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
