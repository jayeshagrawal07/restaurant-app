var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");

var session = require('express-session');

var indexRouter = require('./routes/index');
var areaRouter = require('./routes/area');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware)
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost:27017/RestaurantDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// res.locals is an object passed to ejs engine
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(function(req, res, next){
  res.io = io;
  next();
});

// io.on('connect', (socket) => {
//   const session = socket.request.session;
//   // session.connections++;
//   // session.save();
//   // console.log(session);
// });

app.use('/', indexRouter);
app.use('/area', areaRouter);

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
  res.render('error');
});

module.exports = {app: app, server: server};
