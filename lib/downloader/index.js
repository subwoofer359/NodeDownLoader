var downloadDirectory = 'downloads',
	url = require('url'),
	fs = require('fs'),
	http = require('http'),
	https = require('https');


function getDestinationPath(urlObject) {
	var pathParts = urlObject.pathname.split('/');
	return downloadDirectory + '/' + pathParts[pathParts.length - 1];
}

exports.downloadDirectory = downloadDirectory; 

exports.downloader = function downloader (urlToBeParsed, callback) {
	var parsedUrl = url.parse(urlToBeParsed),
		pathname = getDestinationPath(parsedUrl),
		output = fs.createWriteStream(pathname),
		httpAction;
	
	if(parsedUrl.protocol === 'https:') {
		httpAction = https;
	} else {
		httpAction = http;
	}
	
	var req = httpAction.get(urlToBeParsed, function(response) {
		if(response.statusCode === 200) {
			output.on('error', function (err) {
				callback(err, 'Local file write error');
				response.destory('Local file write error');
			
			});
			response.on('data', function (data) {
				output.write(data);
			});
		
			response.on('end', function () {
				callback(null, 'Finished transfer');
			});
			return;
		}
		req.emit('error', '404 Error');
	}).on('error', function (err) {
		fs.unlink(pathname, function (unlinkerr) {
			callback(new Error('Can\'t read remote file'), 'Can\'t read remote file');
		});
		
	});
};

exports.getDestinationPath = getDestinationPath;