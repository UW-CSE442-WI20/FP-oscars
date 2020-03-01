const d3 = require('d3');

(function() {
	const female = require("./SVG/female-white.svg");
	const femalePink = require("./SVG/female-pink.svg");
	const male = require("./SVG/male-white.svg");
	const maleBlue = require("./SVG/male-blue.svg");
	const noUiSlider = require("nouislider");
	let femaleIconSelected = false;
	let maleIconSelected = false;
	let lastGenreSelected;

	// Make sure the window has loaded before we start trying to 
	// modify the DOM.
	window.addEventListener("load", init);

	function init() {
		id("female").addEventListener("mouseover", changeToPink); 	
		id("female").addEventListener("mouseout", changeBack); 
		id("female").addEventListener("click", clickFemale); 
		id("male").addEventListener("mouseover", changeToBlue);	
		id("male").addEventListener("mouseout", changeBackToMale); 
		id("male").addEventListener("click", clickMale); 
		id("switch-views").addEventListener("click", goToResultsPage);
		id("back").addEventListener("click", goBackToMainPage);
		let elements = qsa(".flex-element");
		for (let i = 0; i < elements.length; i++) {
			let currElement = elements[i];
			currElement.addEventListener("click", function () { clickGenre(elements, i) });
		}
		makeSlider();	
		makeCountryCarousel();
	}

	function makeSlider() {
		let slider = id('slider');
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
		        density: 4,
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
		if (lastGenreSelected == elements[index]) {
			lastGenreSelected.classList.toggle("highlighted-box");
		} else if (lastGenreSelected != null) {
			lastGenreSelected.classList.remove("highlighted-box")
		}
		
		if (lastGenreSelected != elements[index]) {
			lastGenreSelected = elements[index];
			lastGenreSelected.classList.add("highlighted-box");
		}
		console.log(elements[index].textContent);
	}

	function clickFemale() {
		if (maleIconSelected) {
			id("male").classList.toggle("male-color");
		}
		if (id("female").classList.contains("female-color")) {
			femaleIconSelected = false;
			id("female-icon").src = female; 
		} else {
			femaleIconSelected = true;
			maleIconSelected = false;
			id("female-icon").src = femalePink; 
		}
		id("male-icon").src = male;
		id("female").classList.toggle("female-color");
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
			id("female").classList.toggle("female-color");
		}
		if (id("male").classList.contains("male-color")) {
			maleIconSelected = false;
			id("male-icon").src = male; 
		} else {
			maleIconSelected = true;
			femaleIconSelected = false;
			id("male-icon").src = maleBlue; 
		}
		id("female-icon").src = female;
		id("male").classList.toggle("male-color");
	}

	function changeToBlue() {
		id("male-icon").src = maleBlue; 
	}

	function changeBackToMale() {
		if (!maleIconSelected) {
			id("male-icon").src = male;
		}
	}

	function goToResultsPage() {
		id("questions").classList.add("fade-out");
		setTimeout(function() {
			id("questions").style.display = "none";
			id("calculation-page").classList.add("fade-in");
		}, 1000);
		setTimeout(function() {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}, 1000);
		makeGenderDirectorPiChart();
		makeNationalityBarChart();
		makeGenreBarChart();
	}

	function goBackToMainPage() {
		id("calculation-page").style.display = "none";
		id("questions").style.display = "block";
	}

	function makeGenderDirectorPiChart() {
		let data = [177, 8]; // numbers from director_gender.txt

		let color = d3.scaleOrdinal(['#4974B9','#A157A2']);

		let svg = d3.select("#gender-director-pi-chart"),
			width = svg.attr("width"),
			height = svg.attr("height"),
			radius = 150,
			g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		// Generate the pie
		let pie = d3.pie()
					.sort(null)
					.startAngle(1.1*Math.PI)
					.endAngle(3.1*Math.PI);

		// Generate the arcs
		let arc = d3.arc()
					.innerRadius(0)
					.outerRadius(radius);
		
		//Generate groups
		let arcs = g.selectAll("arc")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("class", "arc")
        			.attr("stroke", "white")
					.style("stroke-width", "2px")
		
		// Generate title for pi chart
		svg.append("text")
		   .attr("x", (width / 2))
		   .attr("y", 35)
		   .attr("text-anchor", "middle")
		   .style("font-size", "16px") 
		   .style("font-weight", "bold")
		   .style("fill", "white")
		   .text("Gender Breakdown of Directors of Oscar-Winning-Movies");

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc)
			.transition().delay(500).duration(2000)
			.attrTween("d", function(d) {
				var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
				return function(t) {
					d.endAngle = i(t);
        			return arc(d);
       			}
			  });
			  

		arcs.append("title")
			.text(function(d) {return d.value});
			
		// Draw a legend
		var legend = d3.select("#gender-director-pi-chart")

		legend.append("circle")
			  .attr("cx", (width / 2) - 120)
			  .attr("cy", height - 35)
			  .attr("r", 10)
			  .style("fill", "#4974B9")
			  .style("stroke", "white")

		legend.append("circle")
			  .attr("cx", (width / 2) + 80)
			  .attr("cy", height - 35)
			  .attr("r", 10)
			  .style("fill", "#A157A2")
			  .style("stroke", "white")

		legend.append("text")
			  .attr("x", (width / 2) - 105)
			  .attr("y", height - 30)
			  .text("Male")
			  .style("font-size", "15px")
			  .style("fill", "white")
			  .attr("alignment-baseline","middle")

		legend.append("text")
			  .attr("x", (width / 2) + 95)
			  .attr("y", height - 30)
			  .text("Female")
			  .style("font-size", "15px")
			  .style("fill", "white")
			  .attr("alignment-baseline","middle")
	}

	// Adapted from http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	var randomColor = (function(){
		var golden_ratio_conjugate = 0.618033988749895;
		var h = Math.random();
	
		var hslToRgb = function (h, s, l){
			var r, g, b;
	
			if(s == 0){
				r = g = b = l; // achromatic
			}else{
				function hue2rgb(p, q, t){
					if(t < 0) t += 1;
					if(t > 1) t -= 1;
					if(t < 1/6) return p + (q - p) * 6 * t;
					if(t < 1/2) return q;
					if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				}
	
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
	
			return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
		};
		
		return function(){
		h += golden_ratio_conjugate;
		h %= 1;
		return hslToRgb(h, 0.5, 0.60);
		};
	})();

	function makeGenreBarChart() {
		let svg = d3.select("#genre-bar-chart"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;

        // Generate title for bar chart
        svg.append("text")
           .attr("x", ((width + margin) / 2))
           .attr("y", 40)
           .attr("text-anchor", "middle")
           .style("font-size", "16px") 
		   .style("font-weight", "bold")
		   .style("fill", "white")
		   .text("Genre Breakdown of Oscar-Winning Movies");

		let genreDict = {"Action": 6, "Adventure": 9, "Comedy": 19, "Crime": 12, "Drama": 80, "Family": 1,
						"Fantasy": 6, "History": 31, "Horror": 1, "Music": 8, "Musical": 4, "Mystery": 7,
						"Romance": 23, "Sci-Fi": 6, "Sport": 2, "Thriller": 17, "War": 9, "Western": 1};
		   
		// Create scales for x and y axes
		var xScale = d3.scaleBand()
					    .domain(Object.keys(genreDict))
						.range([0, width])
						.padding([1]);

		var yScale = d3.scaleLinear()
					   .domain([0, 80])
					   .range([height, 0]);
   
		// Add group for the chart axes
		var g = svg.append("g")
				   .attr("transform", "translate(" + 100 + "," + 100 + ")");

		// Create x axis
		g.append("g")
		 .attr("transform", "translate(0," + height + ")")
		 .call(d3.axisBottom(xScale))
		 .selectAll("text")
		 .attr("transform", "translate(-10,10)rotate(-45)")
		 .style("text-anchor", "end");

		// Create y axis
		g.append("g")
		 .call(d3.axisLeft(yScale)
				 .ticks(20));
		
		// Draw bars for each genre
		for (genre in genreDict) {
			let bar = g.append("rect")
					   .attr("x", xScale(genre))
					   .attr("y", yScale(genreDict[genre]))
					   .attr("height", height - yScale(genreDict[genre]))
					   .attr("width", 15)
					   .style("fill", randomColor)
					   .style("opacity", 0.8)
					   .style("stroke", "white")
					   .style("stroke-width", "2px");

			bar.append("title")
			.text(genreDict[genre]);
		}

		// Create x axis label
		svg.append("text")
		   .attr("x", (width + margin) / 2)
		   .attr("y", 670)
		   .attr("text-anchor", "middle")
		   .text("Genre")
		   .style("fill", "white")
		   .style("font-size", "12px");

		// Create y axis label
		svg.append("text")
		   .attr("x", -((height + margin) / 2))
		   .attr("y", 70)
		   .attr("transform", "rotate(-90)")
		   .attr("text-anchor", "middle")
		   .text("# of Oscars")
		   .style("fill", "white")
		   .style("font-size", "12px");
	}

	function makeNationalityBarChart() {
		let svg = d3.select("#nationality-bar-chart"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;

        // Generate title for bar chart
        svg.append("text")
           .attr("x", ((width + margin) / 2))
           .attr("y", 40)
           .attr("text-anchor", "middle")
           .style("font-size", "16px") 
		   .style("font-weight", "bold")
		   .style("fill", "white")
		   .text("Nationality Breakdown of Directors of Oscar-Winning-Movies");

		let nationalityDict = {"American": 105.5, "Australian": 2, "Brazilian": 1, "British": 10, "Canadian": 5.5,
						 "English": 15, "French": 9, "German": 0.5, "Greek": 1, "Irish": 2, "Italian": 1, 
						 "Mexican": 14, "New Zealand": 5, "Norwegian": 1, "Polish":	1.5, "Scottish": 1,
						 "South Korean": 3, "Spanish": 1, "Swiss": 0.5, "Taiwanese": 5};
		   
		// Create scales for x and y axes
		var xScale = d3.scaleBand()
					    .domain(Object.keys(nationalityDict))
						.range([0, width])
						.padding([1]);

		var yScale = d3.scaleLinear()
					   .domain([0, 110])
					   .range([height, 0]);
   
		// Add group for the chart axes
		var g = svg.append("g")
				   .attr("transform", "translate(" + 100 + "," + 100 + ")");

		// Create x axis
		g.append("g")
		 .attr("transform", "translate(0," + height + ")")
		 .call(d3.axisBottom(xScale))
		 .selectAll("text")
		 .attr("transform", "translate(-10,10)rotate(-45)")
		 .style("text-anchor", "end");

		// Create y axis
		g.append("g")
		 .call(d3.axisLeft(yScale)
				 .ticks(20));
		
		// Draw bars for each genre
		for (genre in nationalityDict) {
			let bar = g.append("rect")
					   .attr("x", xScale(genre))
					   .attr("y", yScale(nationalityDict[genre]))
					   .attr("height", height - yScale(nationalityDict[genre]))
					   .attr("width", 15)
					   .style("fill", randomColor)
					   .style("stroke", "white")
					   .style("stroke-width", "2px");

			bar.append("title")
			.text(nationalityDict[genre]);
		}

		// Create x axis label
		svg.append("text")
		   .attr("x", (width + margin) / 2)
		   .attr("y", 690)
		   .attr("text-anchor", "middle")
		   .text("Director Nationality")
		   .style("fill", "white")
		   .style("font-size", "12px");

		// Create y axis label
		svg.append("text")
		   .attr("x", -((height + margin) / 2))
		   .attr("y", 70)
		   .attr("transform", "rotate(-90)")
		   .attr("text-anchor", "middle")
		   .text("# of Oscars")
		   .style("fill", "white")
		   .style("font-size", "12px");
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
