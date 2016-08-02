var http = require('http'),
	https = require('https');

const HTTP_STATUS_OK = 200,
	HTTP_RESOURCE_NOT_FOUND = 404,
	ERROR_FILE_WRITE = 'Local file write error',
	MSG_DOWNLOAD_FINISHED = 'Finished transfer';

function getCorrectHttpObject(urlObject) {
	if(urlObject.protocol === 'https:') {
		return https;
	} else {
		return http;
	}
}

exports.httpCopyFile = function httpCopyFile(urlObject, writer, callback, errorCallback) {
	var httpAction = getCorrectHttpObject(urlObject),
		req = httpAction.get(urlObject.href, function(response) {
		if(response.statusCode === HTTP_STATUS_OK) {
			writer.on('error', function (err) {
				callback(err, ERROR_FILE_WRITE);
				response.destory(ERROR_FILE_WRITE);
			});
			
			response.on('data', function (data) {
				writer.write(data);
			});
		
			response.on('end', function () {
				callback(null, MSG_DOWNLOAD_FINISHED);
			});
			return;
		}
		req.emit('error', http.STATUS_CODES[HTTP_RESOURCE_NOT_FOUND]);
	}).on('error', errorCallback);
};