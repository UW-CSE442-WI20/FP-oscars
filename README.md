# How to Win an Oscar

We started this project with an interest in what types of movies win the most Oscars. 

Is there a specific **genre**? A specific **director gender/nationality**? A specific **gender breakdown in dialogue**? 

So, we analyzed the last 20 years of Oscar-winning movies to see if we could identify any patterns. We limited our search to these Oscars:
* Best Picture
* Best Director
* Best Actor/Actress
* Best Supporting Actor/Actress
* Best Cinematography
* Best Adapted/Original Screenplay

## Genre

We found the genre of each film using [OMDb API](http://www.omdbapi.com/), a RESTful web service to obtain film information. The code for this is located in `calculate-genres.js`. We first found the genres for all the films who had won Oscars in the last 20 years and then added the different genres up across all the films. Some films had up to 6 genres! 

## Director Gender/Nationality

This information is not readily available, so we collected it by hand using Wikipedia. Some directors have dual nationalities (e.g., British-American), so we handled these cases by counting 0.5 towards each nationality present (i.e., 0.5 towards British count and 0.5 towards American count). All directors fit within the gender binary. 

## Gender Breakdown in Dialogue

This was the hardest piece of our project to gather data for. We found a [dataset](https://pudding.cool/2017/03/film-dialogue) that had some of the films we were interested in, but not all of them. So... that meant we had **39** movies that we didn't have the gender dialogue breakdown for. This didn't seem too complicated- most screenplays have a character name followed by their lines and all we had to do was to parse the screenplays, right? Well... not quite. Screenplays are notorious for having lines upon lines of mise en scène (the arrangement of a scene), so it wasn't as simple as we thought.

Less committed folks might have given up at this point, but through the strength of listening to the same songs on repeat from Doja Cat and Harry Styles (Say So and Adore You respectfully... at least for Olga), we read 30 screenplays and manually removed all non-dialogue content from them. Then, we ran `movie-dialogue-breakdown.py` (which we found from [here](https://github.com/pratyakshs/Movie-script-parser) and edited a bit) on the updated screenplays to get the breakdown of character words. The algorithm featured a gender processing aspect to it, but it was unreliable sometimes so we also manually cross-checked character gender to their IMDB page. Any characters that didn't say at least 100 words weren't included in the character counts. We couldn't find the screenplays for 9 films (Dreamgirls, Iris, La Vie en Rose, Once Upon a Time in Hollywood, Pollock, Ray, The Constant Gardener, The Hours, and The Last King of Scotland) :(

We also had to get all of the film posters that would be populated when a user selects a different gender dialogue breakdown on the first page. The code for this is in `get-movie-posters.js`. It also uses [OMDb API](http://www.omdbapi.com/).

After worsening our sight and posture from being hunched over computer screens for who knows how long, we had [all of our data](https://github.com/UW-CSE442-WI20/FP-oscars/blob/master/src/data/dialogue-breakdown.csv) <3
