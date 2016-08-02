var downloadDirectory = 'downloads',
	url = require('url'),
	fs = require('fs'),
	httpCopyFile = require('./httpCopyFile').httpCopyFile;

const ERROR_FILE_WRITE = 'Local file write error',
	  ERROR_CANT_READ_FILE = 'Can\'t read remote file';

function getDestinationPath(urlObject) {
	var pathParts = urlObject.pathname.split('/');
	return downloadDirectory + '/' + pathParts[pathParts.length - 1];
}

exports.downloadDirectory = downloadDirectory; 

exports.getDestinationPath = getDestinationPath;



exports.downloader = function downloader (urlToBeParsed, callback) {
	var parsedUrl = url.parse(urlToBeParsed),
		pathname = getDestinationPath(parsedUrl),
		output = fs.createWriteStream(pathname);
		
	httpCopyFile(parsedUrl, output, callback, function (err) {
		var message = err.message || err;
		fs.unlink(pathname, function (unlinkerr) {
			callback(new Error(ERROR_CANT_READ_FILE), message);
		});
	});
};