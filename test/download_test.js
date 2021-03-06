/*global describe*/
/*global it*/
var express = require('express'),
	should = require('should'),
	download = require('../routes/download'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	errorHandler = require('errorhandler'),
	request = require('supertest'),
	app,
	testUrl = 'http://adrianmclaughlin.ie/images/profile.jpg';

describe('POST /download', function () {
	app = express();
	app.use(bodyParser());
	app.post('/download', download.download);
	it('should return 400 http status code no url given', function (done) {
		request(app)
		.post('/download')
		.expect(400)
		.expect('No url given\n')
		.end(function(err, res) {
			if(err) {
				throw err;
			}
			done();
		});
		
	});
	
	it('should return 200 http status code', function (done) {
		request(app)
		.post('/download')
		.send({url: testUrl})
		.expect(200)
		.expect('Finished transfer' + "\n")
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
		
	});
	
	it('should throw 404 errro', function (done) {
		request(app)
		.post('/download')
		.send({url: 'http://ftp.heanet.ie/pub/linuxmint.com/linuxmint-18-cinnamon-64bit.iso'})
		.expect('Can\'t read remote file\n')
		.expect(500)
		.end(function(err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
});