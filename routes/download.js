var downloader = require('../lib/downloader');
exports.download = function (req, res) {
	if(req.body.url) {
		res.type('application/text');
		downloader.downloader(req.body.url, function (err, message) {
			if(err) {
				if(!res.finished) {
					res.status(500);
					res.send(err.message + "\n");
					res.end();
				}
				return;
			}
			res.send(req.body.url + "\n");
			res.end();
		});
		
	} else {
		res.status(400);
		res.send('No url given\n');
		res.end();
	}
	
};
