/*
Request the movie poster using http://www.omdbapi.com and create a map of
movie posters.

RESULT:

1917: "https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_SX300.jpg"
There Will Be Blood: "https://m.media-amazon.com/images/M/MV5BMjAxODQ4MDU5NV5BMl5BanBnXkFtZTcwMDU4MjU1MQ@@._V1_SX300.jpg"
The Hurt Locker: "https://m.media-amazon.com/images/M/MV5BYWYxZjU2MmQtMmMzYi00ZWUwLTg2ZWQtMDExZTVlYjM3ZWM1XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
The Revenant: "https://m.media-amazon.com/images/M/MV5BMDE5OWMzM2QtOTU2ZS00NzAyLWI2MDEtOTRlYjIxZGM0OWRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg"
....

*/
(function() {
	window.addEventListener("load", init);

	function init() {
		getAllMoviePosters();
	}
	
	function getAllMoviePosters() {
		moviePosters = new Object();
		d3.csv(genderDialogueCSV).then(function(allData) {
			for (let i = 0; i < allData.length; i++) {
				let request = new XMLHttpRequest();
				request.open('GET', 'http://omdbapi.com?apikey=22a62a70&t=' + allData[i]["Movie Title"], true)

				request.onload = function() {
					let data = JSON.parse(this.response);
					console.log(data);
				    if (request.status >= 200 && request.status < 400) {
				    	moviePosters[data.Title] = data.Poster
				    } else {
				    	console.log('error');
				  	}
				}

				request.send();
			}
			setTimeout(function() {
				console.log(moviePosters);
			}, 10000);
			
		});
		
	}
})();
