var downloadDirectory = 'downloads',
	url = require('url'),
	fs = require('fs'),
	http = require('http'),
	https = require('https');

const HTTP_STATUS_OK = 200,
	  HTTP_RESOURCE_NOT_FOUND = 404,
	  ERROR_FILE_WRITE = 'Local file write error',
	  ERROR_CANT_READ_FILE = 'Can\'t read remote file',
	  MSG_DOWNLOAD_FINISHED = 'Finished transfer';

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
		if(response.statusCode === HTTP_STATUS_OK) {
			output.on('error', function (err) {
				callback(err, ERROR_FILE_WRITE);
				response.destory(ERROR_FILE_WRITE);
			
			});
			response.on('data', function (data) {
				output.write(data);
			});
		
			response.on('end', function () {
				callback(null, MSG_DOWNLOAD_FINISHED);
			});
			return;
		}
		req.emit('error', http.STATUS_CODES[HTTP_RESOURCE_NOT_FOUND]);
	}).on('error', function (err) {
		var message = err.message || err;
		fs.unlink(pathname, function (unlinkerr) {
			callback(new Error(ERROR_CANT_READ_FILE), message);
		});
		
	});
};

exports.getDestinationPath = getDestinationPath;