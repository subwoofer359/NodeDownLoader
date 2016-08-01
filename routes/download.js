var downloader = require('../lib/downloader');
exports.download = function (req, res) {
	if(req.body.url) {
		downloader.downloader(req.body.url, function (err, message) {
			if(err) {
				res.status(500);
				res.type('application/text');
				res.send(err.message);
				return;
			}
			
		});
		res.send(req.body.url);
	} else {
		res.status(500);
		res.send('No url given');
	}
	res.end();
};
