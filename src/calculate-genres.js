/*
Request the genre of movies using http://www.omdbapi.com and create a map of
genres.

RESULT:

Map(0) {}
[[Entries]]
0: {"Drama" => 79}
1: {"War" => 9}
2: {"Biography" => 22}
3: {"History" => 9}
4: {"Comedy" => 18}
5: {"Thriller" => 17}
6: {"Action" => 7}
7: {"Adventure" => 10}
8: {"Fantasy" => 7}
9: {"Sci-Fi" => 7}
10: {"Music" => 8}
11: {"Romance" => 23}
12: {"Animation" => 1}
13: {"Crime" => 12}
14: {"Mystery" => 7}
15: {"Musical" => 4}
16: {"Western" => 1}
17: {"Horror" => 1}
18: {"Family" => 1}
19: {"Sport" => 2}
*/

(function() {
	window.addEventListener("load", init);

	function init() {
		getContent();
	}

	function getContent() {
		let genres = new Map();
		// Certain titles won more than one Oscar, so that's why they're in this
		// array  multiple times.
		let titles = ["1917","12 Years a Slave","12 Years a Slave","12 Years a Slave","A Beautiful Mind","A Beautiful Mind","A Beautiful Mind","A Beautiful Mind","Adaptation.","Almost Famous","Argo","Argo","Avatar","Beginners","Birdman","Birdman","Birdman","Birdman","Black Swan","BlacKkKlansman","Blade Runner 2049","Blue Jasmine","Blue Jasmine","Bohemian Rhapsody","Boyhood","Bridge of Spies","Brokeback Mountain","Brokeback Mountain","Call Me by Your Name","Capote","Chicago","Chicago","Cold Mountain","Crash","Crash","Crazy Heart","Crouching Tiger, Hidden Dragon","Dallas Buyers Club","Dallas Buyers Club","Darkest Hour","Django Unchained","Django Unchained","Dreamgirls","Erin Brockovich","Eternal Sunshine of the Spotless Mind","Fences","Get Out","Gladiator","Gladiator","Gosford Park","Gravity","Gravity","Green Book","Green Book","Green Book","Her","Hugo","I, Tonya ","If Beale Street Could Talk","Inception","Inglourious Basterds","Iris","Jojo Rabbit","Joker","Judy","Juno","La La Land","La La Land","La La Land","La Vie en Rose","Les Misérables","Life of Pi","Life of Pi","Lincoln","Little Miss Sunshine","Little Miss Sunshine","Little Miss Sunshine","Little Miss Sunshine","Lost in Translation","Manchester by the Sea","Manchester by the Sea","Marriage Story","Master and Commander:  The Far Side of the World","Memoirs of a Geisha","Michael Clayton","Midnight in Paris","Milk","Milk","Million Dollar Baby","Million Dollar Baby","Million Dollar Baby","Million Dollar Baby","Monster","Monster's Ball","Moonlight","Moonlight","Moonlight","Mystic River","Mystic River","No Country for Old Men","No Country for Old Men","No Country for Old Men","No Country for Old Men","No Country for Old Men","No Country for Old Men","Once Upon a Time in Hollywood","Pan's Labyrinth","Parasite","Parasite","Parasite","Pollock","Precious","Precious","Ray","Road to Perdition","Roma","Roma","Room","Sideways","Silver Linings Playbook","Slumdog Millionaire","Slumdog Millionaire","Slumdog Millionaire","Slumdog Millionaire","Spotlight","Spotlight","Still Alice","Syriana","Talk to Her","The Artist","The Artist","The Artist","The Aviator","The Aviator","The Big Short","The Blind Side","The Constant Gardener","The Danish Girl","The Dark Knight","The Departed","The Departed","The Departed","The Descendants","The Favourite","The Fighter","The Fighter","The Help","The Hours","The Hurt Locker","The Hurt Locker","The Hurt Locker","The Imitation Game","The Iron Lady","The King's Speech","The King's Speech","The King's Speech","The King's Speech","The Last King of Scotland","The Lord of the Rings: The Fellowship of the Ring","The Lord of the Rings: The Return of the King","The Lord of the Rings: The Return of the King","The Lord of the Rings: The Return of the King","The Pianist","The Pianist","The Pianist","The Queen","The Reader","The Revenant","The Revenant","The Revenant","The Shape of Water","The Shape of Water","The Social Network","The Theory of Everything","There Will Be Blood","There Will Be Blood","Three Billboards Outside Ebbing, Missouri","Three Billboards Outside Ebbing, Missouri","Traffic","Traffic","Traffic","Training Day","Vicky Cristina Barcelona","Walk the Line","Whiplash"];
		for (let i = 0; i < titles.length; i++) {
			let request = new XMLHttpRequest()

			request.open('GET', 'http://omdbapi.com?apikey=22a62a70&t=' + titles[i], true)

			request.onload = function() {
				var data = JSON.parse(this.response);

			    if (request.status >= 200 && request.status < 400) {
			    	let genreArray = data.Genre.split(", ");
			        for (let j = 0; j < genreArray.length; j++) {
			        	let currGenre = genreArray[j];
			        	if (genres.get(currGenre) == null) {
			        		genres.set(currGenre, 1);
			        	} else {
			        		genres.set(currGenre, genres.get(currGenre) + 1);
			        	}
			        }
			    } else {
			    	console.log('error');
			  	}
			}

			request.send();
		}
		console.log(genres);
	}
})();
