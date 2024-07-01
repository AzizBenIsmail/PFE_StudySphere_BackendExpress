// Import des dépendances
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const cors = require('cors');
const session = require('express-session');

require("dotenv").config(); //configuration dotenv
require('./controllers/init');

const path = require("path");


const { app, server } = require("./socket/socket.js");

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var prefRouter = require('./routes/pref');
var usersRouter = require('./routes/users');
var xpRouter = require('./routes/xp');
var badgeRouter = require('./routes/badge');
var niveauRouter = require('./routes/niveau');
var notificationRouter = require('./routes/notification');
var formationRouter = require('./routes/formation');
var blogRouter = require('./routes/blog');
var messageRouter = require("./routes/message");
var eventRouter = require("./routes/event");
var favorisRouter = require('./routes/Favoris');

const { connectToMongoDB } = require('./db/db');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'net StudySphere secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(express.static("public"));

app.use(cors({
  origin: process.env.Origin_Front,
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials',
  credentials: true
}));

// Debugging: Log current directory path
const currentDirname = path.dirname(__filename);
console.log("Directory path:", currentDirname);



app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/pref', prefRouter);
app.use('/xp', xpRouter);
app.use('/badge', badgeRouter);
app.use('/niveau', niveauRouter);
app.use('/notification', notificationRouter);
app.use('/formation', formationRouter);
app.use('/blog', blogRouter);
app.use("/messages", messageRouter);
app.use("/calendar", eventRouter);
app.use('/fav', favorisRouter);

app.get('/check', (req, res) => {
  res.status(200).send('Server is running');
});

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Démarrage du serveur
server.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log("app is running on port 5000");
});

module.exports = app;
