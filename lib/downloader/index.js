var downloadDirectory = 'downloads',
	url = require('url'),
	fs = require('fs'),
	https = require('https');


exports.downloadDirectory = downloadDirectory;

function getDestinationPath(urlObject) {
	var pathParts = urlObject.pathname.split('/');
	return downloadDirectory + '/' + pathParts[pathParts.length - 1];
}

exports.downloader = function downloader (urlToBeParsed, callback) {
	var parsedUrl = url.parse(urlToBeParsed),
		pathname = getDestinationPath(parsedUrl),
		output = fs.createWriteStream(pathname);
	
	output.on('error', function (err) {
		callback(err, 'Local file write error');
	});
	
	https.get(urlToBeParsed, function(response) {
		response.on('data', function (data) {
			output.write(data);
		});
		
		response.on('end', function () {
			callback(null, 'Finished transfer');
		});
		
		
	}).on('error', function (err) {
		callback(err, 'Can\'t read remote file');
	});
};

exports.getDestinationPath = getDestinationPath;