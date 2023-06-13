var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const cors = require('cors');
const logMiddleware = require('./middlewares/logMiddleware');
const session = require('express-session');

require("dotenv").config(); //configuration dotenv
const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(
  ()=>{console.log('connect to BD');}
).catch(
  (error)=>{console.log(error.message);}
);

app.use(cors()); // Enable CORS for all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logMiddleware);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
// Configuration de la session
app.use(session({
  secret: 'net attijari secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // À définir sur true si vous utilisez HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie de session (en millisecondes)
  },
}));


// app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions));
app.use('/', indexRouter);
app.use('/auth', authRouter);

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
  res.json('error');
});




const server=http.createServer(app);
server.listen(5000,()=>{console.log("app is runnig on port 5000")});

module.exports = app;
