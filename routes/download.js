var downloader = require('../lib/downloader');
const HTTP_INTERNAL_ERROR = 500,
      HTTP_BAD_REQUEST = 400,
      ERROR_NO_URL = 'No url given\n';
exports.download = function (req, res) {
	if(req.body.url) {
		res.type('application/text');
		downloader.downloader(req.body.url, function (err, message) {
			if(err) {
				if(!res.finished) {
					res.statusCode = HTTP_INTERNAL_ERROR;
					res.send(err.message + "\n");
					res.end();
				}
				return;
			}
			res.send(message + "\n");
			res.end();
		});
		
	} else {
		res.statusCode = HTTP_BAD_REQUEST;
		res.send(ERROR_NO_URL);
		res.end();
	}
	
};
