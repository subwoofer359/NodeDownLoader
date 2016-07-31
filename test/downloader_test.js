/*global describe*/
/*global it*/

var downloader = require('../lib/downloader')
	, fs = require('fs')
	, url = require('url')
	, should = require('should')
	, https = require('https')
	, testFile = 'jennifer-lawrence-hot-sexy-sexiest-photos-beauty-5.jpg'
	, testUrl = 'https://rawmultimedia.files.wordpress.com/2015/12/' + testFile
	, testUrlWithQuery = testUrl + "?r=1"
	, testUrlParsed = url.parse(testUrl);

describe('copy url to destination', function () {
	it('download directory should exist', function (done) {
		fs.stat(downloader.downloadDirectory, function (err, stats) {
			should.not.exist(err, 'Can\'t find directory:' + err);
			should.ok(stats.isDirectory(), 'should be a directory');
			done();
		});
	});
	
	it('should convert url to local path for saving file locally', function () {
		var expectedPath = downloader.downloadDirectory + '/' + testFile;
		should.equal(downloader.getDestinationPath(testUrlParsed), expectedPath);
	});
	
	it('should convert url to local path for saving file locally but remove query', function () {
		var expectedPath = downloader.downloadDirectory + '/' + testFile,
			testUrlParsed = url.parse(testUrlWithQuery);
		should.equal(downloader.getDestinationPath(testUrlParsed), expectedPath);
	});
	
	it('should create a file in download directory', function (done) {
		downloader.downloader(testUrl, function(err, message) {
			console.log(message);
			fs.stat(downloader.getDestinationPath(testUrlParsed), function (err, stats) {
				should.not.exist(err, 'Error thrown:' + err);
				should.ok(stats.isFile(), ' File not found');
				should.ok(stats.size > 0, 'File is empty');
				done();
			});
		});
	});
	
	it('should throw an error on local file issue', function (done) {
		downloader.downloader(testUrl, function(err, message) {
			console.log(message);
			fs.stat(downloader.getDestinationPath(testUrlParsed), function (err, stats) {
				should.not.exist(err, 'Error thrown:' + err);
				should.ok(stats.isFile(), ' File not found');
				should.ok(stats.size > 0, 'File is empty');
				done();
			});
		});
	});
});