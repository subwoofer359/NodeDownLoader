var downloader = require('../lib/downloader');
exports.download = function (req, res) {
	if(req.body.url) {
		res.type('application/text');
		downloader.downloader(req.body.url, function (err, message) {
			if(err) {
				if(!res.finished) {
					res.status(500);
					res.send(err.message);
					res.end();
				}
				console.log(err);
				return;
			}
			res.send(req.body.url);
			res.end();
		});
		
	} else {
		res.status(400);
		res.send('No url given');
		res.end();
	}
	
};
