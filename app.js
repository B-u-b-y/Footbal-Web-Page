var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SpringRouter = require('./routes/server8090');
var ExpressRouter = require('./routes/server8091');
var FlaskRouter = require('./routes/server8092');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // or pug, hbs, etc.

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server8090', SpringRouter);
app.use('/server8091', ExpressRouter);
app.use('/server8092', FlaskRouter);

module.exports = app;
