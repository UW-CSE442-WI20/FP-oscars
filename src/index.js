const d3 = require('d3');

(function() {
	// Turn this off when programming so you don't need to
	// always select a genre/director to get to the next page.
	const WARNING_MODE = true;
	const NUM_SIMILAR_MOVIES = 2;
	const genderDialogueCSV = require("./dialogue-breakdown.csv");
	const genreCSV = require("./genre.csv");
	const nationalityCSV = require("./nationality-redo.csv");
	const female = require("./SVG/female-white.svg");
	const femalePink = require("./SVG/female-pink.svg");
	const male = require("./SVG/male-white.svg");
	const maleBlue = require("./SVG/male-blue.svg");

	// flags
	const germanFlag = require("./flags/066-germany.png");
	const swissFlag = require("./flags/097-switzerland.png");
	const brazilFlag = require("./flags/250-brazil.png");
	const greekFlag = require("./flags/071-greece.png");
	const italianFlag = require("./flags/011-italy.png");
	const norwegianFlag = require("./flags/058-norway.png");
	const scottishFlag = require("./flags/036-scotland.png");
	const spanishFlag = require("./flags/044-spain.png");
	const polishFlag = require("./flags/108-poland.png");
	const australianFlag = require("./flags/130-australia.png");
	const irishFlag = require("./flags/070-ireland.png");
	const southKoreanFlag = require("./flags/055-south-korea.png");
	const newZealandFlag = require("./flags/048-new-zealand.png");
	const taiwaneseFlag = require("./flags/080-taiwan.png");
	const canadianFlag = require("./flags/206-canada.png");
	const frenchFlag = require("./flags/077-france.png");
	const britishFlag = require("./flags/262-united-kingdom.png");
	const mexicanFlag = require("./flags/239-mexico.png");
	const englishFlag = require("./flags/152-england.png");
	const usFlag = require("./flags/153-united-states-of-america.png");
	
	// genre icons
	const familyIcon = require("./SVG/family.svg");
	const horrorIcon = require("./SVG/horror.svg");
	const westernIcon = require("./SVG/western.svg");
	const sportIcon = require("./SVG/sport.svg");
	const musicalIcon = require("./SVG/musical.svg");
	const actionIcon = require("./SVG/action.svg");
	const fantasyIcon = require("./SVG/fantasy.svg");
	const sciFiIcon = require("./SVG/sci-fi.svg");
	const mysteryIcon = require("./SVG/mystery.svg");
	const musicIcon = require("./SVG/music.svg");
	const adventureIcon = require("./SVG/adventure.svg");
	const warIcon = require("./SVG/war.svg");
	const crimeIcon = require("./SVG/crime.svg");
	const thrillerIcon = require("./SVG/thriller.svg");
	const comedyIcon = require("./SVG/comedy.svg");
	const romanceIcon = require("./SVG/heart.svg");
	const historyIcon = require("./SVG/history.svg");
	const dramaIcon = require("./SVG/drama.svg");

	const noUiSlider = require("nouislider");
	const selectize = require("selectize");
	let femaleIconSelected = false;
	let maleIconSelected = false;
	let lastGenreSelected;
	let powerGauge;
	let totalProb;
	let dialogueDotPlotMade = false;
	let nationalityChartMade = false;
	let genreChartMade = false;
	let genderDirectorChartMade = false;
	let currentAngle;

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
		id("back").addEventListener("click",	 goBackToMainPage);
		let elements = qsa(".flex-element");
		for (let i = 0; i < elements.length; i++) {
			let currElement = elements[i];
			currElement.addEventListener("click", function () { clickGenre(elements, i) });
		}
		makeSlider();	
		makeCountryCarousel();
	}


	function getSimilarDialogueMovies() {
		// Generated using get-movie-posters.js
		let posters = {"1917": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_SX300.jpg","There Will Be Blood": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjAxODQ4MDU5NV5BMl5BanBnXkFtZTcwMDU4MjU1MQ@@._V1_SX300.jpg","The Hurt Locker": "https:\/\/m.media-amazon.com\/images\/M\/MV5BYWYxZjU2MmQtMmMzYi00ZWUwLTg2ZWQtMDExZTVlYjM3ZWM1XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg","The Revenant": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMDE5OWMzM2QtOTU2ZS00NzAyLWI2MDEtOTRlYjIxZGM0OWRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg","Master and Commander: The Far Side of the World": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjA5NjYyMDM5NV5BMl5BanBnXkFtZTYwOTU5MDY2._V1_SX300.jpg","Training Day": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMDZkMTUxYWEtMDY5NS00ZTA5LTg3MTItNTlkZWE1YWRjYjMwL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Road to Perdition": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNjcxMmQ0MmItYTkzYy00MmUyLTlhOTQtMmJmNjE3MDMwYjdlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg","Django Unchained": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg","Bridge of Spies": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjIxOTI0MjU5NV5BMl5BanBnXkFtZTgwNzM4OTk4NTE@._V1_SX300.jpg","Milk": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTI2OTM5NjUzMV5BMl5BanBnXkFtZTcwMzY1MTM5MQ@@._V1_SX300.jpg","Argo": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNzljNjY3MDYtYzc0Ni00YjU0LWIyNDUtNTE0ZDRiMGExMjZlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","The Lord of the Rings: The Return of the King": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg","Life of Pi": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNTg2OTY2ODg5OF5BMl5BanBnXkFtZTcwODM5MTYxOA@@._V1_SX300.jpg","Whiplash": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Spotlight": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjIyOTM5OTIzNV5BMl5BanBnXkFtZTgwMDkzODE2NjE@._V1_SX300.jpg","Syriana": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjA2MTQwMTg0N15BMl5BanBnXkFtZTcwOTE5NjEzMQ@@._V1_SX300.jpg","Slumdog Millionaire": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZmNjZWI3NzktYWI1Mi00OTAyLWJkNTYtMzUwYTFlZDA0Y2UwXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Bohemian Rhapsody": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTA2NDc3Njg5NDVeQTJeQWpwZ15BbWU4MDc1NDcxNTUz._V1_SX300.jpg","Green Book": "https:\/\/m.media-amazon.com\/images\/M\/MV5BYzIzYmJlYTYtNGNiYy00N2EwLTk4ZjItMGYyZTJiOTVkM2RlXkEyXkFqcGdeQXVyODY1NDk1NjE@._V1_SX300.jpg","The Departed": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg","The Social Network": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","The Dark Knight": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg","Mystic River": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTIzNDUyMjA4MV5BMl5BanBnXkFtZTYwNDc4ODM3._V1_SX300.jpg","Darkest Hour": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNTU4MjMwOTgyMV5BMl5BanBnXkFtZTgwODQzNjY2NDM@._V1_SX300.jpg","BlacKkKlansman": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjUyOTE1NjI0OF5BMl5BanBnXkFtZTgwMTM4ODQ5NTM@._V1_SX300.jpg","Brokeback Mountain": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTY5NTAzNTc1NF5BMl5BanBnXkFtZTYwNDY4MDc3._V1_SX300.jpg","The King's Speech": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMzU5MjEwMTg2Nl5BMl5BanBnXkFtZTcwNzM3MTYxNA@@._V1_SX300.jpg","Lincoln": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTQzNzczMDUyNV5BMl5BanBnXkFtZTcwNjM2ODEzOA@@._V1_SX300.jpg","No Country for Old Men": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_SX300.jpg","The Lord of the Rings: The Fellowship of the Ring": "https:\/\/m.media-amazon.com\/images\/M\/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg","Gladiator": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Michael Clayton": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTc0NTU5MjI2MV5BMl5BanBnXkFtZTcwMTg5NTQzMw@@._V1_SX300.jpg","The Big Short": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg","Dallas Buyers Club": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTYwMTA4MzgyNF5BMl5BanBnXkFtZTgwMjEyMjE0MDE@._V1_SX300.jpg","Capote": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTczMzU0MjM1MV5BMl5BanBnXkFtZTcwMjczNzgyNA@@._V1_SX300.jpg","Call Me by Your Name": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_SX300.jpg","Crazy Heart": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTU0NDc5NjgzNl5BMl5BanBnXkFtZTcwNzc0NDIzMw@@._V1_SX300.jpg","12 Years a Slave": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjExMTEzODkyN15BMl5BanBnXkFtZTcwNTU4NTc4OQ@@._V1_SX300.jpg","Inception": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg","The Aviator": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZTYzMjA2M2EtYmY1OC00ZWMxLThlY2YtZGI3MTQzOWM4YjE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Sideways": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTU0Mjg3MzkxOV5BMl5BanBnXkFtZTYwNDU1OTY3._V1_SX300.jpg","Joker": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg","A Beautiful Mind": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Million Dollar Baby": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTkxNzA1NDQxOV5BMl5BanBnXkFtZTcwNTkyMTIzMw@@._V1_SX300.jpg","The Shape of Water": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_SX300.jpg","Les Misérables": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTQ4NDI3NDg4M15BMl5BanBnXkFtZTcwMjY5OTI1OA@@._V1_SX300.jpg","Inglourious Basterds": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg","Beginners": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjAyNDcxNTk3NV5BMl5BanBnXkFtZTcwMjk4MDU2NA@@._V1_SX300.jpg","Crash": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTk1OTA1MjIyNV5BMl5BanBnXkFtZTcwODQxMTkyMQ@@._V1_SX300.jpg","Moonlight": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyMDA3OTE@._V1_SX300.jpg","Manchester by the Sea": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTYxMjk0NDg4Ml5BMl5BanBnXkFtZTgwODcyNjA5OTE@._V1_SX300.jpg","The Pianist": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOWRiZDIxZjktMTA1NC00MDQ2LWEzMjUtMTliZmY3NjQ3ODJiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Monster's Ball": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNTkyMzk3NTYtY2FiYy00MWIwLWIyYzctODIzNzVlOGQxZmYwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Fences": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTg0Nzc1NjA0MV5BMl5BanBnXkFtZTgwNTcyNDQ0MDI@._V1_SX300.jpg","Jojo Rabbit": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZjU0Yzk2MzEtMjAzYy00MzY0LTg2YmItM2RkNzdkY2ZhN2JkXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SX300.jpg","The Fighter": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTM0ODk3MjM1MV5BMl5BanBnXkFtZTcwNzc1MDIwNA@@._V1_SX300.jpg","Silver Linings Playbook": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTM2MTI5NzA3MF5BMl5BanBnXkFtZTcwODExNTc0OA@@._V1_SX300.jpg","Get Out": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX300.jpg","Talk to Her": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMzBlNDhiMmMtNDVlNy00NjQ5LWJlYjEtYjc4ZTVjZjM4ZWIxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Adaptation.": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZjIwZWU0ZDItNzBlNS00MDIwLWFlZjctZTJjODdjZWYxNzczL2ltYWdlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","The Imitation Game": "https:\/\/m.media-amazon.com\/images\/M\/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhYjQ4L2ltYWdlXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_SX300.jpg","The Descendants": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjAyNTA1MTcyN15BMl5BanBnXkFtZTcwNjEyODczNQ@@._V1_SX300.jpg","Traffic": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNDA2YjNkMjEtZjcwNy00ZTc5LWEzNDItMjE0ODlmMDAzNDFkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Birdman": "https:\/\/m.media-amazon.com\/images\/M\/MV5BODAzNDMxMzAxOV5BMl5BanBnXkFtZTgwMDMxMjA4MjE@._V1_SX300.jpg","The Theory of Everything": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTAwMTU4MDA3NDNeQTJeQWpwZ15BbWU4MDk4NTMxNTIx._V1_SX300.jpg","The Reader": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTM0NDQxNjA0N15BMl5BanBnXkFtZTcwNDUwMzcwMg@@._V1_SX300.jpg","Little Miss Sunshine": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTgzNTgzODU0NV5BMl5BanBnXkFtZTcwMjEyMjMzMQ@@._V1_SX300.jpg","The Artist": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMDUyZWU5N2UtOWFlMy00MTI0LTk0ZDYtMzFhNjljODBhZDA5XkEyXkFqcGdeQXVyNzA4ODc3ODU@._V1_SX300.jpg","Avatar": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg","Three Billboards Outside Ebbing, Missouri": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjI0ODcxNzM1N15BMl5BanBnXkFtZTgwMzIwMTEwNDI@._V1_SX300.jpg","Boyhood": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTYzNDc2MDc0N15BMl5BanBnXkFtZTgwOTcwMDQ5MTE@._V1_SX300.jpg","Almost Famous": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMzY1ZjMwMGEtYTY1ZS00ZDllLTk0ZmUtYzA3ZTA4NmYwNGNkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg","Hugo": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjAzNzk5MzgyNF5BMl5BanBnXkFtZTcwOTE4NDU5Ng@@._V1_SX300.jpg","Midnight in Paris": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTM4NjY1MDQwMl5BMl5BanBnXkFtZTcwNTI3Njg3NA@@._V1_SX300.jpg","Blade Runner 2049": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg","Pan's Labyrinth": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTU3ODg2NjQ5NF5BMl5BanBnXkFtZTcwMDEwODgzMQ@@._V1_SX300.jpg","The Queen": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTQ3NTMxODg1Ml5BMl5BanBnXkFtZTcwMjEyMjczMQ@@._V1_SX300.jpg","Gravity": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_SX300.jpg","If Beale Street Could Talk": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZWVkMzY5NzgtMTdlNS00NjY5LThjOTktZWFkNDU3NmQzMDIwXkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_SX300.jpg","Vicky Cristina Barcelona": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNjVkZGE1OWItYjMzNC00ZTcwLThiODAtYmYwNzJkMjk5OTVhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Parasite": "https:\/\/m.media-amazon.com\/images\/M\/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg","La La Land": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg","Marriage Story": "https:\/\/m.media-amazon.com\/images\/M\/MV5BZGVmY2RjNDgtMTc3Yy00YmY0LTgwODItYzBjNWJhNTRlYjdkXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_SX300.jpg","Gosford Park": "https:\/\/m.media-amazon.com\/images\/M\/MV5BYzM4YzlhZGMtYTI2Yi00OTY4LWE0MzctNDFlYTQ3YmFlOTBjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Cold Mountain": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTY3NTc5NzcyOF5BMl5BanBnXkFtZTcwMDM0NjQyMQ@@._V1_SX300.jpg","The Blind Side": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjEzOTE3ODM3OF5BMl5BanBnXkFtZTcwMzYyODI4Mg@@._V1_SX300.jpg","I, Tonya": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjI5MDY1NjYzMl5BMl5BanBnXkFtZTgwNjIzNDAxNDM@._V1_SX300.jpg","Chicago": "https:\/\/m.media-amazon.com\/images\/M\/MV5BN2E3NDU1ZTktNzZjNy00MWU3LWI4YmMtMjdjNTIzMDU0MDdiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg","Lost in Translation": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTI2NDI5ODk4N15BMl5BanBnXkFtZTYwMTI3NTE3._V1_SX300.jpg","Black Swan": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNzY2NzI4OTE5MF5BMl5BanBnXkFtZTcwMjMyNDY4Mw@@._V1_SX300.jpg","The Danish Girl": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjA0NjA4NjE2Nl5BMl5BanBnXkFtZTgwNzIxNTY2NjE@._V1_SX300.jpg","Room": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjE4NzgzNzEwMl5BMl5BanBnXkFtZTgwMTMzMDE0NjE@._V1_SX300.jpg","Still Alice": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjIzNzAxNjY1Nl5BMl5BanBnXkFtZTgwMDg4ODQxMzE@._V1_SX300.jpg","Erin Brockovich": "https:\/\/m.media-amazon.com\/images\/M\/MV5BYTA1NWRkNTktNDMxNS00NjE4LWEzMDAtNzA3YzlhYzRhNDA4L2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Crouching Tiger, Hidden Dragon": "https:\/\/m.media-amazon.com\/images\/M\/MV5BNDdhMzMxOTctNDMyNS00NTZmLTljNWEtNTc4MDBmZTYxY2NmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg","Roma": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTU0OTc3ODk4Ml5BMl5BanBnXkFtZTgwMzM4NzI5NjM@._V1_SX300.jpg","The Iron Lady": "https:\/\/m.media-amazon.com\/images\/M\/MV5BODEzNDUyMDE3NF5BMl5BanBnXkFtZTcwMTgzOTg3Ng@@._V1_SX300.jpg","Memoirs of a Geisha": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTYxMzM4NTEzOV5BMl5BanBnXkFtZTcwNDMwNjQzMw@@._V1_SX300.jpg","Blue Jasmine": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTc0ODk5MzEyMV5BMl5BanBnXkFtZTcwMzI0MDY1OQ@@._V1_SX300.jpg","Juno": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTIwMDgwODc5Nl5BMl5BanBnXkFtZTYwMjQzMDM4._V1_SX300.jpg","The Help": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTM5OTMyMjIxOV5BMl5BanBnXkFtZTcwNzU4MjIwNQ@@._V1_SX300.jpg","Her": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMjA1Nzk0OTM2OF5BMl5BanBnXkFtZTgwNjU2NjEwMDE@._V1_SX300.jpg","Eternal Sunshine of the Spotless Mind": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg","Precious": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTk3NDM4ODMwNl5BMl5BanBnXkFtZTcwMTYyNDIzMw@@._V1_SX300.jpg","Monster": "https:\/\/m.media-amazon.com\/images\/M\/MV5BMTI4NzI5NzEwNl5BMl5BanBnXkFtZTcwNjc1NjQyMQ@@._V1_SX300.jpg"}
		let percent = id("gender-percent").innerText;
		id("similar-movies-intro-text").innerText = "Some examples of movies with a similar female dialogue percentage are: ";
		d3.csv(genderDialogueCSV).then(function(allData) {
			const x = d3.scaleLinear()
		    	.domain([0, 100]);
			let nbins = 20;
			const histogram = d3.histogram()
		      .domain(x.domain())
		      .thresholds(x.ticks(nbins))
		      .value(d => d["Percent Female"]);

		    //binning data and filtering out empty bins
		    const bins = histogram(allData);
		    let percentIndex = parseInt(percent) / 5;
		    let numMovies = 0;
		    if (bins[percentIndex] != null) {
	    		let movieArr = getRandomMovies(bins[percentIndex].length, bins, percentIndex);
	    		if (movieArr.length <  NUM_SIMILAR_MOVIES) {
	    			let numNeeded = NUM_SIMILAR_MOVIES - movieArr.length;
	    			while (numNeeded > 0) {
    					let random = Math.floor(Math.random() * Math.floor(2));
	    				if (random == 0 || percentIndex >= 19) {
	    					percentIndex--;
	    				} else {
	    					percentIndex++;
	    				}
    				
	    				let anotherArr = getRandomMovies(numNeeded, bins, percentIndex);
	    				if (movieArr[0] != anotherArr[0]) {
	    					numNeeded -= anotherArr.length;
	    					movieArr = movieArr.concat(anotherArr);
	    				}
	    				
	    			}
	    		}
	    		$(".poster").remove().fadeOut();
	    		$(".poster-text").remove();
	    		$(".poster-container").remove();
	    		for (let i = 0; i < movieArr.length; i++) {
					addPoster(posters[movieArr[i]], movieArr[i]);
	    		}
		    }
		});
	}

	function addPoster(posterImage, movieTitle) {
		let div = document.createElement("div");
		div.className = "poster-container";
		let poster = document.createElement("img");
		poster.src = posterImage;
		poster.className = "poster";
		id("similar-movies-images").appendChild(poster);
		let title = document.createElement("div");
		title.innerText = movieTitle + " ";
		title.className = "poster-text";
		div.appendChild(poster);
		div.appendChild(title);
		id("similar-movies-images").append(div);
	}

	function getRandomMovies(numMovies, bins, percentIndex) {
		let totalInBin = bins[percentIndex].length;
	    let movies = getRandomNumbers(totalInBin > numMovies ? numMovies : totalInBin);
		let movieArr = [];
		for (let i = 0; i < movies.length; i++) {
			movieArr[i] = bins[percentIndex][movies[i]]["Movie Title"];
		}
		return movieArr;
	}

	function getRandomNumbers(max) {
		let arr = [];
		let numNumbers = max > NUM_SIMILAR_MOVIES ? NUM_SIMILAR_MOVIES : max;
		while (arr.length < numNumbers){
		    let random = Math.floor(Math.random() * Math.floor(max));
		    if (arr.indexOf(random) === -1) {
		    	arr.push(random);
		    }
		}
		return arr;
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
	        getSimilarDialogueMovies();
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
		let notSelectedDirector = !id("female").classList.contains("female-color") && !id("male").classList.contains("male-color");
		let notSelectedGenre = qs(".highlighted-box span") == null;
		if (WARNING_MODE && notSelectedDirector && notSelectedGenre) {
			issueWarning("a director gender and a movie genre!");
		} else if (WARNING_MODE && notSelectedDirector) {
			issueWarning("a director gender!");
		} else if (WARNING_MODE && notSelectedGenre) {
			issueWarning("a movie genre!");
	  	} else {
			transition(id("questions"));
			setTimeout(function() {
				transition(id("calculation-page"));
			}, 1000);
			setTimeout(function() {
				document.body.scrollTop = 0; // For Safari
				document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
				createGauge();
			}, 1000);
			// use this for drop down menu changes to be reflected on graph
			document.addEventListener("input", function(event) { 
				d3.selectAll("#power-gauge > *").remove()
				calculateLikelihood();
				createGauge();
			});
			lockInSelections();
			d3.selectAll("#power-gauge > *").remove();
			$(document).on("scroll", function() {
				if(isScrolledIntoView("dialog-dot-chart") && !dialogueDotPlotMade) {
					dialogueDotPlotMade = true;
					makeDialogueDotPlot();
				}
				if (isScrolledIntoView("gender-director-pi-chart") && !genderDirectorChartMade) {
					genderDirectorChartMade = true;
					makeGenderDirectorPiChart();
				}
				if (isScrolledIntoView("nationality-bar-chart") && !nationalityChartMade) {
					nationalityChartMade = true;
					makeNationalityBarChart();
				}
				if (isScrolledIntoView("genre-bar-chart") && !genreChartMade) {
					genreChartMade = true;
					makeGenreBarChart();
				}
			});
			calculateLikelihood();
		}
	}

	function issueWarning(warning) {
		id("warning").innerText = "Whoa there. Make sure you've selected " + warning;
		id("warning").classList.add("red-text");
		setTimeout(function() {
			id("warning").innerText = "Okay, now let's...";
			id("warning").classList.remove("red-text");
		}, 5000)
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

	function isScrolledIntoView(elem) {
	    let rect = id(elem).getBoundingClientRect();
	    let elemTop = rect.top;
	    let elemBottom = rect.bottom;

	    let isVisible = elemTop < window.innerHeight && elemBottom > 0;
	    return isVisible;
	}
			
	function lockInSelections() {
		if (WARNING_MODE) {
			id("dialog-selection").value = id("gender-percent").innerText;
			id("director-gender").value = id("female").classList.contains("female-color") ? "female" : "male";
			id("director-nationality").value = qs(".is-selected .carousel-text").innerText.toLowerCase();
			id("genre-selection").value = qs(".highlighted-box span").innerText.toLowerCase();
		} else {
			console.log("Turn off WARNING_MODE to see the selections");
		}
	}

	function calculateLikelihood() {
		let director_data = [177, 8]; // numbers from director_gender.txt
		let director_total = 185;
		let genreDict = {"family": 1, "horror": 1, "western": 1, "sport": 2, "musical": 4,
		"action": 6, "fantasy": 6, "sci-fi": 6, "mystery": 7, "music": 8,
		"adventure": 9,  "war": 9, "crime": 12, "thriller": 17, "comedy": 19,
		"romance": 23, "history": 31, "drama": 80};
		let total_genres = 237;

		let nationalityDict = {"german": 0.5, "swiss": 0.5, "brazilian": 1, "greek": 1, "italian": 1,
							   "norwegian": 1, "scottish": 1, "spanish": 1, "polish": 0.5, 
							   "australian": 3.5, "irish": 1.5, "south Korean": 1, "new Zealand": 3,
							   "taiwanese": 3, "canadian": 3.5, "french": 5, "british": 6,
							   "mexican": 6, "english": 11, "american": 65.5};
		
		let dialogue_percentages = [0, 0, 0, 0, 0, 1.14, 1.7, 2.95, 3.1, 3.21, 3.6, 3.72, 4.01, 5.59, 6.41, 6.87, 7.04, 7.1, 7.5, 7.65, 9.55, 9.68, 9.77, 10.1, 10.27, 10.6, 12.01, 13.69, 13.94, 14.6, 14.8,
		15.05, 15.12, 15.23, 15.44, 15.46, 15.6, 16.29, 16.99261993, 17.66, 17.75, 18.16, 18.5,
		18.74, 19, 19.29, 20.39, 21.91, 22.02, 22.4, 22.6, 23.94, 24.21, 24.99, 25, 25.67189432,
		26.73, 28, 28.55, 29.58, 30.58, 30.9, 31.96, 32.26, 32.55, 32.97, 33.6858006, 33.77,
		34.2, 35.33859669, 35.7, 37.03, 39.1291975, 39.5, 43, 43.66, 44.29, 45.51, 46,47.22605575, 47.96, 50.11845668, 50.31, 51.48, 52.48, 52.92, 53, 53, 54.35, 54.73075753, 55.66, 56.26780627, 61.12, 61.18, 61.72, 70, 70.17954723, 70.23, 71.38, 75.65, 77.34, 87.17, 90.14196367, 91.69, 99.35];					   
		let total_nationalities = 185;
		let total_dialogue_counts = dialogue_percentages.length;
		let total_female_count = 0;
		let max_percent = 0.08068;
		selected_gender = id("director-gender").value;
		selected_nationality = id("director-nationality").value;
		console.log(id("director-nationality").value);
		selected_genre = id("genre-selection").value;
		selected_dialogue = id("dialog-selection").value;
		selected_dialogue = parseInt(selected_dialogue.substring(0, selected_dialogue.length - 1));

		// this is the ideal solution, but alas, not working :(
		// d3.csv(genderDialogueCSV).then(function(allData) {
		// 	let total_female_count = 0;
		// 	allData.forEach(function(d) { 
		// 		percent_female = parseInt(d["Percent Female"]);
		// 		// console.log(Math.abs(percent_female - selected_dialogue));
		// 		if (Math.abs(percent_female - selected_dialogue) <= 10) {
		// 			total_female_count = total_female_count + 1;
		// 		}
		// 		total_dialogue_counts = total_dialogue_counts + 1;
		// 	});
		// });

		// count up the number of films with dialogue percentages similar to the 
		// users selection
		for (i = 0; i < dialogue_percentages.length; i++) {
			curr_female_percent = dialogue_percentages[i];
			if (Math.abs(curr_female_percent - selected_dialogue) <= 10) {
				total_female_count = total_female_count + 1;
			}
		}
		// get probabilities for each category separately
		gender_to_use = selected_gender == "female" ? director_data[1] : director_data[0];
		gender_prob = gender_to_use / director_total;
		nationality_prob = nationalityDict[selected_nationality] / total_nationalities
		genre_prob = genreDict[selected_genre] / total_genres;
		dialogue_prob = total_female_count / total_dialogue_counts;
		total_prob = gender_prob * nationality_prob * genre_prob * dialogue_prob;
		console.log("director gender prob: " + gender_prob);
		console.log("nationality prob: " + nationality_prob);
		console.log("genre prob: " + genre_prob);
		console.log("dialogue prob: " + dialogue_prob);
		console.log("total prob: " + (total_prob / max_percent) * 100);
		totalProb = (total_prob / max_percent) * 100;

		// id("dialogue-breakdown-percent").innerText = dialogue_prob.toFixed(2);
		// id("director-gender-percent").innerText = gender_prob.toFixed(2);
		// id("director-nationality-percent").innerText = nationality_prob.toFixed(2);
		// id("genre-percent").innerText = genre_prob.toFixed(2);
		// id("total-percent").innerText = total_prob.toFixed(2);
	}

	function capitalize(selection) {
		result = selection.charAt(0).toUpperCase() + selection.substring(1);
		hyphen = selection.indexOf("-");
		if (hyphen != -1) {
			result = result.substring(0, hyphen + 1) + + result.charAt(hyphen + 1).toUpperCase + result.substring(hyphen + 2);
		}
		return result;
	}

	function goBackToMainPage() {
		transition(id("questions"));
		transition(id("calculation-page"));
		setTimeout(function() {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}, 1000);
		qs(".tooltip").remove();
	}

	function makeGenderDirectorPiChart() {
		let data = [177, 8]; // numbers from director_gender.txt
		let total = 185;

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

		const tooltip = d3.select("body")
						  .append("div")
						  .attr("class", "tooltip")
						  .style("opacity", 0);
		
		// Generate groups
		let arcs = g.selectAll(".arc")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("class", "arc")
					.on("mouseover", function(d) {
						tooltip.transition()
							.duration(200)		
							.style("opacity", 1.0)		
						tooltip.html(100 * (Math.round(d.value) / (1.0 * total)).toFixed(3) + "%")	
							.style("left", (d3.event.pageX) + "px")		
							.style("top", (d3.event.pageY) + "px")
							.style("background-color", function() {
								if (d.value < 50) {
									return "#edbfe9";
								} else {
									return "#bbd6ed";
								}
							});		
				    })	
					.on("mouseout", function() {
						tooltip.transition()
						       .duration(500)		
						       .style("opacity", 0);	
				   });

		arcs.append("path")
			.style("fill", function(d, i) {
				return color(i);
			})
			.transition()
			.delay(function(d, i) {
				return i * 4000;
			}).duration(4000)
			.attrTween('d', function(d) {
				let i = d3.interpolate(d.startAngle+0.1, d.endAngle);
				return function(t) {
					d.endAngle = i(t);
        			return arc(d);
       			}
			 })
				
		// Draw a legend
		let legend = d3.select("#gender-director-pi-chart")

		legend.append("circle")
			  .attr("cx", (width / 2) - 120)
			  .attr("cy", height - 35)
			  .attr("r", 10)
			  .style("fill", "#6BA6D9")
			  .style("stroke", "white");

		legend.append("circle")
			  .attr("cx", (width / 2) + 80)
			  .attr("cy", height - 35)
			  .attr("r", 10)
			  .style("fill", "#D873CF")
			  .style("stroke", "white");

		legend.append("text")
			  .attr("x", (width / 2) - 105)
			  .attr("y", height - 30)
			  .text("Male")
			  .style("font-size", "15px")
			  .style("fill", "white")
			  .attr("alignment-baseline","middle");

		legend.append("text")
			  .attr("x", (width / 2) + 95)
			  .attr("y", height - 30)
			  .text("Female")
			  .style("font-size", "15px")
			  .style("fill", "white")
			  .attr("alignment-baseline","middle");
	}

	function makeGenreBarChart() {
		let svg = d3.select("#genre-bar-chart"),
			marginLeft = 150,
			marginTop = 100,
            margin = 200,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;

		// Add group for the chart axes
		let g = svg.append("g")
				   .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// Make tooltip element
		const tooltip = d3.select("body")
						  .append("div")
						  .attr("class", "tooltip")
						  .style("opacity", 0);

		let genres = [familyIcon, horrorIcon, westernIcon, sportIcon, musicalIcon,
					  actionIcon, fantasyIcon, sciFiIcon, mysteryIcon, musicIcon,
					  adventureIcon, warIcon, crimeIcon, thrillerIcon, comedyIcon,
					  romanceIcon, historyIcon, dramaIcon];

		d3.csv(genreCSV).then(function(data) {
			// Create scales for x and y axes
			let xScale = d3.scaleLinear()
						   .domain([0, 80])
						   .range([0, width]);

			let yScale = d3.scaleBand()
			               .domain(data.map(function(d) { return d.genre; } ))
						   .range([0, height]);

			// Create x axis
			g.append("g")
			 .attr("transform", "translate(0," + height + ")")
			 .call(d3.axisBottom(xScale)
					 .ticks(20));

			// Create y axis
			g.append("g")
			 .call(d3.axisLeft(yScale)
			 		 .tickFormat((d) => '')
					 .tickSize(0));

			// Create x axis label
			svg.append("text")
			   .attr("x", (width + 2 * marginLeft) / 2)
			   .attr("y", 650)
			   .attr("text-anchor", "middle")
			   .text("# of Oscars")
			   .style("fill", "white")
			   .style("font-size", "18px");

			// Create y axis label
			svg.append("text")
			   .attr("x", -((height + 2 * marginTop) / 2))
			   .attr("y", 20)
			   .attr("transform", "rotate(-90)")
			   .attr("text-anchor", "middle")
			   .text("Genre")
			   .style("fill", "white")
			   .style("font-size", "18px");

			// Draw bars
			svg.selectAll(".bar")
			   .data(data)
			   .enter()
			   .append("rect")
			   .attr("class", "bar")
			   .attr("x", xScale(0) + marginLeft)
			   .attr("y", function(d) { return yScale(d.genre) + marginTop; })
			   .attr("height", 20)
			   .style("fill", "#6BA6D9")
			   .style("opacity", 0.8)
			   .style("stroke", "black")
			   .style("stroke-width", "1px")
			   .on("mouseover", function(d) {
				   tooltip.transition()
					      .duration(200)		
						  .style("opacity", 1.0)		
				   tooltip.html("<b>" + d.genre + ": " + "</b>" + d.value)	
					      .style("left", (d3.event.pageX) + "px")		
						  .style("top", (d3.event.pageY) + "px")
						  .style("background-color", d3.select(this).style("fill"))		
			   })	
			   .on("mouseout", function() {
				   tooltip.transition()
					      .duration(500)		
					      .style("opacity", 0);	
		       })
			   .attr("width", 0)
        	   .transition()
               .duration(3000)
			   .attr("width", function(d) { return xScale(d.value); });

			// Put genre name along y-axis
			svg.selectAll("genre-name")
			   .data(data)
			   .enter()
			   .append("text")
			   .attr("x", xScale(0) + marginLeft - 41)
			   .attr("y", function(d) { return yScale(d.genre) + marginTop + 10; })
			   .text(function(d) { return d.genre; })
			   .style("fill", "white")
			   .style("font-size", "11px")
			   .attr("text-anchor", "end");

			// Put genre icon along y-axis
			svg.selectAll("genre-icon")
			   .data(data)
			   .enter()
			   .append("image")
			   .attr("x", xScale(0) + marginLeft / 3 + 64.5)
			   .attr("y", function(d) { return yScale(d.genre) + marginTop - 2; })
			   .attr("height", "18")
			   .attr("width", "18")
			   .attr("xlink:href", function(d, i) { return genres[i]; });
		});
	}

	function makeNationalityBarChart() {
		let svg = d3.select("#nationality-bar-chart"),
			marginLeft = 150,
			marginTop = 100,
            margin = 200,
            width = svg.attr("width") - margin,
			height = svg.attr("height") - margin;
			
		// Add group for the chart axes
		let g = svg.append("g")
				   .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

		// Make tooltip element
		const tooltip = d3.select("body")
						  .append("div")
						  .attr("class", "tooltip")
						  .style("opacity", 0);
		
		let europe = ["German", "Swiss", "Greek", "Italian", "Norwegian", "Scottish", "Spanish",
					  "Polish", "Irish", "French", "British", "English"]; // red 
		let america = ["Canadian", "Mexican", "American", "Brazilian"]; // blue
		let oceania = ["Australian", "New Zealand"]; // green
		let asia = ["South Korean", "Taiwanese"]; // yellow

		let flags = [germanFlag, swissFlag, brazilFlag, greekFlag, italianFlag, norwegianFlag,
					 scottishFlag, spanishFlag, polishFlag, australianFlag, irishFlag,
					 southKoreanFlag, newZealandFlag, taiwaneseFlag, canadianFlag, frenchFlag,
					 britishFlag, mexicanFlag, englishFlag, usFlag];

		const legendDelay = 2500;
		const legendDuration = 2000;

		d3.csv(nationalityCSV).then(function(data) {
			// Create scales for x and y axes
			let xScale = d3.scaleLinear()
						   .domain([0, 70])
						   .range([0, width]);

			let yScale = d3.scaleBand()
						   .domain(data.map(function(d) { return d.nationality; } ))
						   .range([0, height]);

			// Create x axis
			g.append("g")
			 .attr("transform", "translate(0," + height + ")")
			 .call(d3.axisBottom(xScale)
			   		 .ticks(20));

	   		// Create y axis
	   		g.append("g")
			 .call(d3.axisLeft(yScale)
					 .tickFormat((d) => '')
					 .tickSize(0));
					 
	   		// Create x axis label
	   		svg.append("text")
		  	   .attr("x", (width + 2 * marginLeft) / 2)
		  	   .attr("y", 650)
		  	   .attr("text-anchor", "middle")
		  	   .text("# of Oscars")
		  	   .style("fill", "white")
		  	   .style("font-size", "18px");

	   		// Create y axis label
	   		svg.append("text")
		  	   .attr("x", -((height + 2 * marginTop) / 2))
		  	   .attr("y", 20)
		  	   .attr("transform", "rotate(-90)")
		  	   .attr("text-anchor", "middle")
		  	   .text("Director Nationality")
		  	   .style("fill", "white")
		  	   .style("font-size", "18px");

			// Draw bars
			svg.selectAll(".bar")
			   .data(data)
			   .enter()
			   .append("rect")
			   .attr("class", "bar")
			   .attr("x", xScale(0) + marginLeft)
			   .attr("y", function(d) { return yScale(d.nationality) + marginTop; })
			   .attr("height", 20)
			   .style("fill", function(d) {
					   if (europe.includes(d.nationality)) {
						   return "#C677B1";
					   } else if (america.includes(d.nationality)) {
						   return "#6BA6D9";
					   } else if (oceania.includes(d.nationality)) {
						   return "#91C95C"; 
					   } else {
						   return "#FED800";
					   }
			   })
			   .style("stroke", "black")
			   .style("stroke-width", "1px")
			   .on("mouseover", function(d) {
				   tooltip.transition()
					      .duration(200)		
						  .style("opacity", 1.0)		
				   tooltip.html("<b>" + d.nationality + ": " + "</b>" + d.value)	
					      .style("left", (d3.event.pageX) + "px")		
						  .style("top", (d3.event.pageY) + "px")
						  .style("background-color", d3.select(this).style("fill"))		
			   })	
			   .on("mouseout", function() {
				   tooltip.transition()
					      .duration(500)		
					      .style("opacity", 0);	
		       })
			   .attr("width", 0)
        	   .transition()
			   .duration(3000)
			   .attr("width", function(d) { return xScale(d.value); });

			// Put nationality name along y-axis
			svg.selectAll("nationality-name")
			   .data(data)
			   .enter()
			   .append("text")
			   .attr("x", xScale(0) + marginLeft - 43)
			   .attr("y", function(d) { return yScale(d.nationality) + marginTop + 10; })
			   .text(function(d) { return d.nationality; })
			   .style("fill", "white")
			   .style("font-size", "11px")
			   .attr("text-anchor", "end");

			// Put nationality flag along y-axis
			svg.selectAll("flag")
			   .data(data)
			   .enter()
			   .append("image")
			   .attr("x", xScale(0) + marginLeft / 3 + 64.5)
			   .attr("y", function(d) { return yScale(d.nationality) + marginTop - 2; })
			   .attr("height", "18")
			   .attr("width", "18")
			   .attr("xlink:href", function(d, i) { return flags[i]; });

			// Make continent legend
		  	svg.append("text")
				  .attr("x", (width / 2) + 265)
				  .attr("y", (height / 3) - 30)
				  .text("Continents")
				  .style("font-size", "17px")
				  .style("text-decoration", "underline solid white")
				  .style("fill", "white")
				  .attr("alignment-baseline","middle")
				  .style("opacity", 0)
                  .transition()
                  .delay(legendDelay)
                  .duration(legendDuration)
                  .style("opacity", 1);

		  	svg.append("circle")
				.attr("cx", (width / 2) + 270)
				.attr("cy", height / 3)
				.attr("r", 10)
				.style("fill", "#6BA6D9")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);  

			svg.append("circle")
				.attr("cx", (width / 2) + 270)
				.attr("cy", (height / 3) + 25)
				.attr("r", 10)
				.style("fill", "#C677B1")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("circle")
				.attr("cx", (width / 2) + 270)
				.attr("cy", (height / 3) + 50)
				.attr("r", 10)
				.style("fill", "#FED800")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("circle")
				.attr("cx", (width / 2) + 270)
				.attr("cy", (height / 3) + 75)
				.attr("r", 10)
				.style("fill", "#91C95B")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("text")
				.attr("x", (width / 2) + 290)
				.attr("y", (height / 3) + 1.5)
				.text("Americas")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("text")
				.attr("x", (width / 2) + 290)
				.attr("y", (height / 3) + 26.5)
				.text("Europe")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("text")
				.attr("x", (width / 2) + 290)
				.attr("y", (height / 3) + 51.5)
				.text("Asia")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("text")
				.attr("x", (width / 2) + 290)
				.attr("y", (height / 3) + 76.5)
				.text("Oceania")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
                  .transition()
                  .delay(legendDelay)
                  .duration(legendDuration)
                  .style("opacity", 1);
		});
	}

	function makeDialogueDotPlot() {
		//SVG setup
		const margin = {top: 60, right: 30, bottom: 150, left: 30},
		      width = 600 - margin.left - margin.right,
		      height = 600 - margin.top - margin.bottom;

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
	    	.attr("height", height + margin.bottom + margin.top + 20)
		  	.append("g")
		    	.attr("transform",
		            `translate(${margin.left}, ${margin.top / 2})`);

	    //number of bins for histogram
		const nbins = 20;
		const tooltip = d3.select("body")	
		  	.append("div")
		    .attr("class", "tooltip")
			.style("opacity", 0);
		
		const legendDelay = 3750;
		const legendDuration = 2000;

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
	              			title: p["Movie Title"],
	              			year: p["Year"],
	                      	radius: (x(d.x1) - x(d.x0)) / 3.75};
	          }))
	          .enter()
	          .append("circle")
	          .attr("cx", 0) //g element already at correct x pos
         	  .attr("r", d => d.radius)
         	  .on("mouseover", function(d) {
         	  	tooltip.transition()
                .duration(200)		
                .style("opacity", 1.0);		
		            tooltip.html("<b>" + d.title + " (" + d.year + ")" + "</b><br/>"  + (Math.round(d.value * 100) / 100).toFixed(2) + "%")	
		                .style("left", (d3.event.pageX) + 20 + "px")		
		                .style("top", (d3.event.pageY - 28) + "px")
		                .style("background-color", function() {
		                	if (d.value < 50) {
				          		return "#6BA6D9";
				          	} else if (d.value > 50 && d.value < 55) {
				          		return "#9D82BC";
				          	} else {
				          		return "#D873CF";
				          	}
		                });	
		      })	
         	  .on("mouseout", function() {
	        	  	tooltip.transition()		
	                .duration(500)		
	                .style("opacity", 0);	
			  })
			  .attr("cy", -height)
			  .attr("display", "none")
              .transition()
			  .duration(1250)
			  .delay(function(d, i){ return i * 250 })
			  .attr("display", "block")
			  .attr("class", function(d) {
	          	if (d.value < 50) {
	          		return "male-circle";
	          	} else if (d.value > 50 && d.value < 55) {
	          		return "purple-circle";
	          	} else {
	          		return "female-circle";
	          	}
	          })
              .attr("cy", (d, i) => {return - i * 2.75 * d.radius - d.radius});

	        svg.append("g")
				  .attr("class", "axis axis--x")
				  .attr("transform", "translate(0," + height + ")")
				  .call(d3.axisBottom(x));

			svg.append("text")
				   .attr("x", (width) / 2)
				   .attr("y", 440)
				   .attr("text-anchor", "middle")
				   .text("Percent")
				   .style("fill", "white")
				   .style("font-size", "18px");
			
			// Make dialogue legend
			svg.append("circle")
			    .attr("cx", (width / 2) + 130)
			    .attr("cy", height / 3)
			    .attr("r", 10)
			    .style("fill", "#6BA6D9")
			    .style("opacity", 0)
			    .transition()
			    .delay(legendDelay)
			    .duration(legendDuration)
			    .style("opacity", 1);

			svg.append("circle")
				.attr("cx", (width / 2) + 130)
				.attr("cy", (height / 3) + 25)
				.attr("r", 10)
				.style("fill", "#9D82BC")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1); 

			svg.append("circle")
				.attr("cx", (width / 2) + 130)
				.attr("cy", (height / 3) + 50)
				.attr("r", 10)
				.style("fill", "#D873CF")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1); 

			svg.append("text")
				.attr("x", (width / 2) + 150)
				.attr("y", (height / 3) + 2)
				.text("Predominantly male")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);

			svg.append("text")
				.attr("x", (width / 2) + 150)
				.attr("y", (height / 3) + 27)
				.text("Evenly distributed")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1); 

			svg.append("text")
				.attr("x", (width / 2) + 150)
				.attr("y", (height / 3) + 52)
				.text("Predominantly female")
				.style("font-size", "15px")
				.style("fill", "white")
				.attr("alignment-baseline","middle")
				.style("opacity", 0)
				.transition()
				.delay(legendDelay)
				.duration(legendDuration)
				.style("opacity", 1);
	     	});
	}

	// Code from https://blockbuilder.org/rishabhfitkids/305e8da9f4311917c6046afcf7bfd0bc
	function createGauge() {
		powerGauge = gauge('#power-gauge', {
			size: 500,
			clipWidth: 500,
			clipHeight: 500,
			ringWidth: 60,
			maxValue: 100,
			transitionMs: 4000,
		});
		powerGauge.render();
		updateGauge(Math.round(totalProb));
	}

	function updateGauge(likelihood) {
		console.log(likelihood);
		powerGauge.update(likelihood);
		const response = ["definitely not you!", "probably not you!", "probably you!", "definitely you!"];
		const colors = ['#CE3741', '#EA8039', '#FED800','#91C95C'];
		let index = likelihood == 100 ? 3 : Math.floor(likelihood / 25) % 4;
		id("gauge-text").innerText = response[index];
		id("gauge-text").style.color = colors[index];
	}

	let gauge = function(container, configuration) {
			let that = {};
			let config = {
				size						: 400,
				clipWidth					: 500,
				clipHeight					: 500,
				ringInset					: 20,
				ringWidth					: 20,
				
				pointerWidth				: 10,
				pointerTailLength			: 9,
				pointerHeadLengthPercent	: 0.9,
				
				minValue					: 0,
				maxValue					: 100,
				
				minAngle					: -90,
				maxAngle					: 90,
				
				transitionMs				: 500,
				
				majorTicks					: 4,
				labelFormat					: d3.format('d'),
				labelInset					: 10,
				
				arcColorFn					: function(i) {
												const colors = ['#CE3741', '#EA8039', '#FED800','#91C95C'];
												return colors[i];
												}
			};
			let range = undefined;
			let r = undefined;
			let pointerHeadLength = undefined;
			let value = 0;
			
			let svg = undefined;
			let arc = undefined;
			let scale = undefined;
			let ticks = undefined;
			let tickData = undefined;
			let pointer = undefined;

			let donut = d3.pie();
			
			function deg2rad(deg) {
				return deg * Math.PI / 180;
			}
			
			function newAngle(d) {
				let ratio = scale(d);
				let newAngle = config.minAngle + (ratio * range);
				return newAngle;
			}
			
			function configure(configuration) {
				let prop = undefined;
				for ( prop in configuration ) {
					config[prop] = configuration[prop];
				}
				
				range = config.maxAngle - config.minAngle;
				r = config.size / 2;
				pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

				// a linear scale that maps domain values to a percent from 0..1
				scale = d3.scaleLinear()
					.range([0,1])
					.domain([config.minValue, config.maxValue]);
					
				ticks = scale.ticks(config.majorTicks);
				tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
				
				arc = d3.arc()
					.innerRadius(r - config.ringWidth - config.ringInset)
					.outerRadius(r - config.ringInset)
					.startAngle(function(d, i) {
						let ratio = d * i;
						return deg2rad(config.minAngle + (ratio * range));
					})
					.endAngle(function(d, i) {
						let ratio = d * (i+1);
						return deg2rad(config.minAngle + (ratio * range));
					});
			}
			that.configure = configure;
			
			function centerTranslation() {
				return 'translate('+r +','+ r +')';
			}
			
			function isRendered() {
				return (svg !== undefined);
			}
			that.isRendered = isRendered;
			
			function render(newValue) {
				svg = d3.select(container)
					.append('svg:svg')
						.attr('class', 'gauge')
						.attr('width', config.clipWidth)
						.attr('height', config.clipHeight);
				
				let centerTx = centerTranslation();
				
				let arcs = svg.append('g')
						.attr('class', 'arc')
						.attr('transform', centerTx);
				
				arcs.selectAll('path')
						.data(tickData)
					.enter().append('path')
						.attr('fill', function(d, i) {
							return config.arcColorFn(i);
						})
						.attr('d', arc);

				let lineData = [ [config.pointerWidth / 2, 0], 
								[0, -pointerHeadLength],
								[-(config.pointerWidth / 2), 0],
								[0, config.pointerTailLength],
								[config.pointerWidth / 2, 0] ];
				let pointerLine = d3.line().curve(d3.curveLinear)
				let pg = svg.append('g').data([lineData])
						.attr('class', 'pointer')
						.attr('transform', centerTx);	
				let angle = currentAngle != null ? currentAngle : config.minAngle;	
				pointer = pg.append('path')
					.attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
					.attr('transform', 'rotate(' + angle +')');
					
				update(newValue === undefined ? 0 : newValue);
			}
			that.render = render;
			function update(newValue, newConfiguration) {
				if ( newConfiguration  !== undefined) {
					configure(newConfiguration);
				}
				let ratio = scale(newValue);
				currentAngle = config.minAngle + (ratio * range);
				if (currentAngle == -90) {
					pointer.transition()
					.duration(500)
					.ease(d3.easePolyOut)
					.attr('transform', 'rotate(' + -85 +')');
					pointer.transition()
					.duration(config.transitionMs)
					.delay(500)
					.ease(d3.easePolyOut)
					.attr('transform', 'rotate(' + -90 +')');
				} else {
					pointer.transition()
					.duration(config.transitionMs)
					.ease(d3.easePolyOut)
					.attr('transform', 'rotate(' +currentAngle +')');
				}
				
			}
			that.update = update;

			configure(configuration);
			
			return that;
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
