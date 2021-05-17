var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jdRoulter = require('./routes/jd');
var talentRoulter = require('./routes/talent')
var loaddataRoulter = require('./routes/loaddata')
var emailtemplateRouter = require('./routes/emailtemplate')

var app = express();

// view engine setup
var corsOptions = {
  origin: 'http://localhost:3001',
}

app.use(cors(corsOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
 });
app.use('/api/jd', jdRoulter);
app.use('/api/talent', talentRoulter);
app.use('/api/loaddata', loaddataRoulter);
app.use('/api/emailtemplate', emailtemplateRouter);

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

app.listen(8888, () => {
  console.log(`listening at http://localhost:8888`)
})

module.exports = app;
