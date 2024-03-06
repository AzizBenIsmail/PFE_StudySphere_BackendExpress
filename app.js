var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const cors = require('cors');
const logMiddleware = require('./middlewares/authLogMiddleware');
const session = require('express-session');
require('./controllers/init');

require("dotenv").config(); //configuration dotenv

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var prefRouter = require('./routes/pref');
var usersRouter = require('./routes/users');
var xpRouter = require('./routes/xp');
var badgeRouter = require('./routes/badge');
var niveauRouter = require('./routes/niveau');
var notificationRouter = require('./routes/notification');
const { connectToMongoDB } = require('./db/db')


var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(logMiddleware);
app.use(session({
  secret: 'net attijari secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // À définir sur true si vous utilisez HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie de session (en millisecondes)
  },
}));
app.use(express.static("public"));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials',
  credentials: true
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/pref', prefRouter);
app.use('/xp', xpRouter);
app.use('/badge', badgeRouter);
app.use('/niveau', niveauRouter);
app.use('/notification', notificationRouter);

// ...

const server = http.createServer(app);
server.listen(5000, () => {connectToMongoDB();
  console.log("app is running on port 5000") });

module.exports = app;
