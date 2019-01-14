var createError = require('http-errors');
var express = require('express');

var apiRouter = require('./code/router')

var app = express();

// API setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);


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
  res.json({error: err.message});
});

app.listen(process.env.PORT || 3000)


// After app start

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO, { useNewUrlParser: true })
.catch ((error)=>{
    console.log(error);
});
