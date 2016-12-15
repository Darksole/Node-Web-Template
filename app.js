var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bootstrap = require("express-bootstrap-service");
var download = require('downloadjs');
var validator = require('email-validator');
var nodemailer = require('nodemailer');
var router = express.Router();

//Pages
var contact = require('./routes/contact');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bootstrap.serve);
app.use('/static', express.static('/public'));

app.use('/', routes);
app.use('/contact', contact);

//Contact form
app.post('/contact', function(req, res){
	console.log(req.body);
	if(req.body.company)
		res.render('error');

	if(!req.body.name || !req.body.email || !req.body.message)
		res.render('error');

	var check = validator.validate(req.body.email);

	if(check == false)
		res.render('error');

	var mailOpts, smtpTrans;

	smtpTrans = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: "",
			pass: ""
		}
	});

	mailOptions = {
		from: '',
		to: '',
		subject: 'Website contact',
		text: req.body.message + '\n NAME:' + req.body.name + '\n EMAIL:' + req.body.email
	};

	smtpTrans.sendMail(mailOptions, function(error, info){
		if(error)
			res.render('error');
		else
			res.render('contact');
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
