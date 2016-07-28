
exports.download = function (req, res) {
	if(req.body.url) {
		res.status(200);
		res.type('application/text');
		res.send(req.body.url);
	} else {
		res.status(500);
		res.send('No url given');
	}
	res.end();
};
