/*global describe*/
/*global it*/

var downloader = require('../lib/downloader'),
	fs = require('fs'),
	url = require('url'),
	should = require('should'),
	events = require('events'),
	rewire = require('rewire'),
	sinon = require('sinon'),
	testFile = 'profile.jpg',
	testUrl = 'http://adrianmclaughlin.ie/images/' + testFile,
	testUrlWithQuery = testUrl + "?r=1",
	testUrlParsed = url.parse(testUrl);


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
			fs.stat(downloader.getDestinationPath(testUrlParsed), function (err, stats) {
				should.not.exist(err, 'Error thrown:' + err);
				should.ok(stats.isFile(), ' File not found');
				should.ok(stats.size > 0, 'File is empty');
				done();
			});
		});
	});
	
	it('should throw an error on http call', function (done) {
		/*
		 * Using rewire to mock out calls to http and https
		 * in httpCopyFile module
		 * also to rewire this back into downloader module 
		 */
		var httpCopyFile = rewire('../lib/downloader/httpCopyFile.js'),
			downloader = rewire('../lib/downloader/index.js');
		
		var mock = { 
				eventEmitter: new events.EventEmitter(),
				get: function (url, callback) {
					return this;
				},
				on: function(event, callback) {
					callback('error', 'Can\'t read remote file');
				}},
			revertHttps = httpCopyFile.__set__('https', mock),
			revertHttp = httpCopyFile.__set__('http', mock),
			revertLoader = downloader.__set__('httpCopyFile', httpCopyFile.httpCopyFile);
		
		downloader.downloader(testUrl, function(err, message) {
			should.exist(err);
			should.equal('Can\'t read remote file', err.message);
			revertHttp();
			revertHttps();
			revertLoader();
			done();
		});	
	});
	
	it('should throw an error on fs call', function (done) {
		downloader = rewire('../lib/downloader');
		var revert = downloader.__set__('fs', {
			write: function (data) {
				this.eventEmitter.emit('error', 'Local file write error');
			},
			createWriteStream: function(pathname) {
				this.eventEmitter = new events.EventEmitter();
				return this;
			},
			on: function(event, callback) {
				this.eventEmitter.on(event, callback);
			}});
		
		var isNotDone = true;
		downloader.downloader(testUrl, function(err, message) {
			
			should.exist(err);
			should.equal('Local file write error', message);
			revert();
			//Todo find out why this method is being called twice 
			if(isNotDone) {
				isNotDone = false;
				done();
			}
		});	
	});
	
});