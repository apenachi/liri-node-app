
var helper = require('./helper');


// console.log('\x1b[36m');  // change terminal font color
// debugger;

if (helper.command === 'my-tweets') {
	helper.myTweets();
} else if (helper.command === 'spotify-this-song') {
	var song = helper.parameter? helper.parameter : 'The+Sign';
	helper.spotifyThisSong(song);
} else if (helper.command === 'movie-this') {
	var movie = helper.parameter? helper.parameter : 'Mr.+Nobody';
	helper.movieThis(movie)
} else if (helper.command === 'do-what-it-says') {
	helper.doWhatItSays();
} else {
	console.log('liri: Undefined command');
}

helper.logger(helper.terminal + helper.parameter.replace(/\+/g, ' '));
