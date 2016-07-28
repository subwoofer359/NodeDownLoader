
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , download = require('./routes/download')
  , favicon = require('serve-favicon')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , http = require('http')
  , path = require('path')
  , multer = require('multer')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true 
}));
app.use(methodOverride());
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.post('/download', download.download);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
