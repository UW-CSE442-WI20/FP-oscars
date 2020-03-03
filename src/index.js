const d3 = require('d3');

(function() {
	const genderDialogueCSV = require("./dialogue-breakdown.csv");
	const female = require("./SVG/female-white.svg");
	const femalePink = require("./SVG/female-pink.svg");
	const male = require("./SVG/male-white.svg");
	const maleBlue = require("./SVG/male-blue.svg");
	const noUiSlider = require("nouislider");
	const selectize = require("selectize");
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
		makeDialogueDotPlot();
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
		if ((!id("female").classList.contains("female-color") && !id("male").classList.contains("male-color"))
			|| qs(".is-selected .carousel-text") == null || qs(".highlighted-box span") == null) {
			id("warning").innerText = "Whoa there. Make sure you've selected a director gender and movie genre!";
			id("warning").classList.add("red-text");
			setTimeout(function() {
				id("warning").innerText = "Okay, now let's...";
				id("warning").classList.remove("red-text");
			}, 5000)
		} else {
			transition(id("questions"));
			setTimeout(function() {
				transition(id("calculation-page"));
			}, 1000);
			setTimeout(function() {
				document.body.scrollTop = 0; // For Safari
				document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
			}, 1000);
			lockInSelections();
			makeGenderDirectorPiChart();
			makeNationalityBarChart();
			makeGenreBarChart();
		}
	}


	function transition(element) {
		if (element.classList.contains('hidden')) {
		    element.classList.remove('hidden');
		    setTimeout(function () {
		      element.classList.remove('visually-hidden');
		    }, 50);
		} else {
		    element.classList.add('visually-hidden');    
		    element.addEventListener('transitionend', function(e) {
		      element.classList.add('hidden');
		    }, {
		      capture: false,
		      once: true,
		      passive: false
		    });
		}
	}
			
			 
	

	function lockInSelections() {
		id("dialog-selection").innerText = id("gender-percent").innerText;
		id("director-gender").innerText = id("female").classList.contains("female-color") ? "female" : "male";
		id("director-nationality").innerText = qs(".is-selected .carousel-text").innerText;
		id("genre-selection").innerText = qs(".highlighted-box span").innerText.toLowerCase();
		// $('#director-gender').selectize({

		// 	options: [
		// 		{gender: "Male"},
		// 		{gender: "Female"}
		// 	],
		// 	labelField: 'Gender',
		// 	placeholder: id("director-gender").innerText,
		//     create: true,
		//     sortField: 'text'
		// });
	}

	function goBackToMainPage() {
		transition(id("questions"));
		transition(id("calculation-page"));
		setTimeout(function() {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}, 1000);
	}

	function makeGenderDirectorPiChart() {
		let data = [177, 8]; // numbers from director_gender.txt

		let color = d3.scaleOrdinal(['#6BA6D9','#D873CF']);

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
		   .attr("class", "chart-title")
		   .attr("x", (width / 2))
		   .attr("y", 35)
		   .attr("text-anchor", "middle")
		   .text("Gender Breakdown of Directors of Oscar-Winning Movies");

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
			  .style("fill", "#6BA6D9")
			  .style("stroke", "white")

		legend.append("circle")
			  .attr("cx", (width / 2) + 80)
			  .attr("cy", height - 35)
			  .attr("r", 10)
			  .style("fill", "#D873CF")
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
           .attr("class", "chart-title")
           .attr("x", ((width + margin) / 2))
           .attr("y", 40)
           .attr("text-anchor", "middle")
		   .text("Genre Breakdown of Oscar-Winning Movies");

		let genreDict = {"Family": 1, "Horror": 1, "Western": 1, "Sport": 2, "Musical": 4,
						 "Action": 6, "Fantasy": 6, "Sci-Fi": 6, "Mystery": 7, "Music": 8,
						 "Adventure": 9,  "War": 9, "Crime": 12, "Thriller": 17, "Comedy": 19,
						 "Romance": 23, "History": 31, "Drama": 80};
		   
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
		   .attr("y", 690)
		   .attr("text-anchor", "middle")
		   .text("Genre")
		   .style("fill", "white")
		   .style("font-size", "18px");

		// Create y axis label
		svg.append("text")
		   .attr("x", -((height + margin) / 2))
		   .attr("y", 70)
		   .attr("transform", "rotate(-90)")
		   .attr("text-anchor", "middle")
		   .text("# of Oscars")
		   .style("fill", "white")
		   .style("font-size", "18px");
	}

	function makeNationalityBarChart() {
		let svg = d3.select("#nationality-bar-chart"),
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;

        // Generate title for bar chart
        svg.append("text")
           .attr("class", "chart-title")
           .attr("x", ((width + margin) / 2))
           .attr("y", 40)
           .attr("text-anchor", "middle")
		   .text("Nationality Breakdown of Directors of Oscar-Winning-Movies");

		let nationalityDict = {"German": 0.5, "Swiss": 0.5, "Brazilian": 1, "Greek": 1, "Italian": 1,
							   "Norwegian": 1, "Scottish": 1, "Spanish": 1, "Polish": 1.5, 
							   "Australian": 2, "Irish": 2, "South Korean": 3, "New Zealand": 5,
							   "Taiwanese": 5, "Canadian": 5.5, "French": 9, "British": 10,
							   "Mexican": 14, "English": 15, "American": 105.5};
		   
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
		   .style("font-size", "18px");

		// Create y axis label
		svg.append("text")
		   .attr("x", -((height + margin) / 2))
		   .attr("y", 70)
		   .attr("transform", "rotate(-90)")
		   .attr("text-anchor", "middle")
		   .text("# of Oscars")
		   .style("fill", "white")
		   .style("font-size", "18px");
	}

	function makeDialogueDotPlot() {
		//SVG setup
		const margin = {top: 60, right: 30, bottom: 30, left: 30},
		      width = 700 - margin.left - margin.right,
		      height = 450 - margin.top - margin.bottom;

		//x scales
		const x = d3.scaleLinear()
		    .rangeRound([0, width])
		    .domain([0, 100]);
		const y = d3.scaleLinear()
		    .rangeRound([0, height])
		    .domain([0, 14]);

		//set up svg
		let svg = d3.select("#dialog-dot-chart")
			.attr("width", width + margin.left + margin.right)
	    	.attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    	.attr("transform",
		            `translate(${margin.left}, ${margin.top})`);

		svg.append("text")
            .attr("class", "chart-title")
            .attr("x", ((width + margin.left) / 2))
            .attr("y", 40)
            .attr("text-anchor", "middle")
		    .text("Percent Female Lines in Oscar-Winning Movies");

	    //number of bins for histogram
		const nbins = 20;
		const tooltip = d3.select("#dialog-dot-chart")
		  .append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);

		d3.csv(genderDialogueCSV).then(function(allData) {

		    //histogram binning
		    const histogram = d3.histogram()
		      .domain(x.domain())
		      .thresholds(x.ticks(nbins))
		      .value(d => d["Percent Female"]);

		    //binning data and filtering out empty bins
		    const bins = histogram(allData).filter(d => d.length>0);

		    let binContainer = svg.selectAll("g.gBin")
	          .data(bins)
	          .enter()
	          .append("g")
	          .attr("class", "gBin")
	          .attr("transform", d => `translate(${x(d.x0)}, ${height})`)
	          .selectAll("circle")
	          .data(d => d.map((p, i) => {
	              	return {value: p["Percent Female"],
	                      	radius: (x(d.x1) - x(d.x0)) / 4};
	          }))
	          .enter()
	          .append("circle")
	          .attr("class", function(d) {
	          	if (d.value < 50) {
	          		return "male-circle";
	          	} else if (d.value > 50 && d.value < 55) {
	          		return "purple-circle";
	          	} else {
	          		return "female-circle";
	          	}
	          })
	          .attr("cx", 0) //g element already at correct x pos
	          .attr("cy", (d, i) => {
	              return - i * 2.5 * d.radius - d.radius})
         	  .attr("r", d => d.radius)
         	  .on("mouseover", tooltipOn)
        	  .on("mouseout", tooltipOff)
        	  .transition()
	          .duration(500)
	          .attr("r", function(d) {
	          return (d.length==0) ? 0 : d.radius; });

	        svg.append("g")
				  .attr("class", "axis axis--x")
				  .attr("transform", "translate(0," + height + ")")
				  .call(d3.axisBottom(x));
			// svg.append("circle")
			// 	  .attr("cx", (width / 2) - 120)
			// 	  .attr("cy", height)
			// 	  .attr("r", 10)
			// 	  .style("fill", "#6BA6D9")
			// 	  .style("stroke", "white")

			// svg.append("circle")
			// 	  .attr("cx", (width / 2) + 80)
			// 	  .attr("cy", height)
			// 	  .attr("r", 10)
			// 	  .style("fill", "#D873CF")
			// 	  .style("stroke", "white")
			// svg.append("text")
			//   .attr("x", (width / 2) - 105)
			//   .attr("y", height)
			//   .text("Male-dominated")
			//   .style("font-size", "15px")
			//   .style("fill", "white")
			//   .attr("alignment-baseline","middle")

			// svg.append("text")
			// 	  .attr("x", (width / 2) + 95)
			// 	  .attr("y", height)
			// 	  .text("Female-dominated")
			// 	  .style("font-size", "15px")
			// 	  .style("fill", "white")
			// 	  .attr("alignment-baseline","middle")
	     	});

      	function tooltipOn(d) {
		  //x position of parent g element
		  let gParent = d3.select(this.parentElement)
		  let translateValue = gParent.attr("transform")

		  let gX = translateValue.split(",")[0].split("(")[1]
		  let gY = height + (+d3.select(this).attr("cy")-50)

		  d3.select(this)
		    .classed("selected", true)
		  tooltip.transition()
		       .duration(200)
		       .style("opacity", .9);
		  tooltip.html(d.name + "<br/> (" + d.value + ")")
		    .style("left", gX + "px")
		    .style("top", gY + "px");
		}//tooltipOn

		function tooltipOff(d) {
		  d3.select(this)
		      .classed("selected", false);
		    tooltip.transition()
		         .duration(500)
		         .style("opacity", 0);
		}//tooltipOff
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
