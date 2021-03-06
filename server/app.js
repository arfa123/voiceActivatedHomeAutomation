require("dotenv").config();
var createError = require('http-errors');
var cors = require('cors')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var roomsRouter = require('./routes/rooms');
var categoriesRouter = require('./routes/categories');
var appliancesRouter = require('./routes/appliances');
var commandRouter = require('./routes/command');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'adminPanel/build')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/appliances', appliancesRouter);
app.use('/api/command', commandRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

module.exports = app;