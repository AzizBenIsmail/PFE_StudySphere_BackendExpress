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
var companyRouter = require('./routes/company');
var companySmsRouter = require('./routes/companySms');

var app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
  () => {
    console.log('connect to BD');
  }
).catch(
  (error) => {
    console.log(error.message);
  }
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logMiddleware);
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
app.use('/company', companyRouter);
app.use('/CompanySMS', companySmsRouter);

// ...

const server = http.createServer(app);
server.listen(5000, () => { console.log("app is running on port 5000") });

module.exports = app;
