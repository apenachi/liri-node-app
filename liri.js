var fs = require('fs');
var random = 'random.txt';
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var keys = require('./keys');
var command = process.argv[2];
var hostname = require('os').hostname().split('.')[0];
var terminal = '[' + hostname + ']$: node liri.js ';

console.log('\x1b[36m');  // change terminal font color
// debugger;
var parameter = process.argv.slice(3).join('+');
if (command === 'my-tweets') {
	myTweets();
} else if (command === 'spotify-this-song') {
	var song = parameter? parameter : 'The+Sign';
	spotifyThisSong(song);
} else if (command === 'movie-this') {
	var movie = parameter? parameter : 'Mr.+Nobody';
	movieThis(movie)
} else if (command === 'do-what-it-says') {
	doWhatItSays();
} else {
	console.log('liri: Undefined command');
}

logger(terminal + command + ' ' + parameter.replace(/\+/g, ' '));

function logger(log) {
	var date = new Date();
	var content = date.toLocaleString('en-US') + ': ' + log + ' ' + parameter.replace(/\+/g, ' ') + '\n';
	var content = log + '\n';

	fs.appendFile('log.txt', content, function(err) {
		if(err) {return console.error(err);}
	});
}

function myTweets() {
	var twitterClient = new twitter(keys.twitterKeys);
	twitterClient.get('statuses/user_timeline.json', {count:20}, function(error, tweets, response) {
		if (!error && response.statusCode === 200) {
			var tweetText = '';
			tweets.forEach(function(tweet, i) {
				tweetText += tweet.created_at.split('+')[0].trim() + ': ' + tweet.text + '\n';
			});
			console.log(tweetText);
			logger(tweetText);
			logger('-'.repeat(75));
		};
	});
};

function spotifyThisSong(thisSong) {
	spotify.search({ type: 'track', query: thisSong }, function(error, response) {
		if (error) { return console.error('Sorry Could not find song ...');}
			var result = 
				response.tracks.items[0].artists[0].name + '\n' +
				response.tracks.items[0].album.name + '\n' +
				response.tracks.items[0].album.external_urls.spotify + '\n' +
				response.tracks.items[0].name ;
			logger(result);
			console.log(result);
			logger('-'.repeat(75));
	});	
}

function movieThis(thisMovie) {
	var queryUrl = 'http://www.omdbapi.com/?t=' + thisMovie +'&tomatoes=true&r=json';
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var movie = JSON.parse(body);
			var result  = 
				'Title : ' + movie['Title'] + '\n' +
				'Year  : ' + movie['Year'] + '\n' +
				'imdbID: ' + movie['imdbID'] + '\n' +
				'Country: ' + movie['Country'] + '\n' +
				'Language: ' + movie['Language'] + '\n' +
				'Plot: ' + movie['Plot'] + '\n' +
				'Actors: ' + movie['Actors'] + '\n' +
				'Rotten Tomatoes Rating: ' + movie['tomatoRating'] + '\n' +
				'Rotton Tomatoes URL: ' + movie['tomatoURL'] ;
			logger(result);
			logger('-'.repeat(75));
			console.log(result);
		}
	});
}

function doWhatItSays() {
	fs.readFile(random, 'utf8', function(err, data){
		data.split('\n').forEach(function(line, num) {
			console.log(line);
		});
		var command = data.split(',')[0];
		var parameter = data.split(',')[1].split('"')[1].replace(/ /g, '+');
		var exec = require('child_process').exec;
		exec('node liri.js ' + command + ' ' + parameter, function(err, stdout, stderr) {
			console.log(stdout);
			logger(stdout);
			logger('-'.repeat(75));
		})
		// if (command === 'my-tweets') {
		// 	myTweets();
		// } else if (command === 'spotify-this-song') {
		// 	var song = parameter? parameter : 'The+Sign';
		// 	spotifyThisSong(song);
		// } else if (command === 'movie-this') {
		// 	var movie = parameter? parameter : 'Mr.+Nobody';
		// 	movieThis(movie)
		// }
	})
}
