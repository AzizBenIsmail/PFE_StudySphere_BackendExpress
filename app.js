var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const cors = require("cors");
const logMiddleware = require("./middlewares/authLogMiddleware");
const session = require("express-session");
const multer = require("multer");
const { fileURLToPath } = require("url");
const path = require("path");
const { upload } = require("./middlewares/uploadFils/uploadFileChat.js");

const { app, server } = require("./socket/socket.js");



require("dotenv").config(); //configuration dotenv

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var prefRouter = require('./routes/pref');
var usersRouter = require('./routes/users');
var xpRouter = require('./routes/xp');
var badgeRouter = require('./routes/badge');
var niveauRouter = require('./routes/niveau');
var notificationRouter = require('./routes/notification');
var formationRouter = require('./routes/formation');
var calendarRouter = require('./routes/calendar');
const { connectToMongoDB } = require('./db/db')

require("./controllers/init");

require("dotenv").config(); //configuration dotenv

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var prefRouter = require("./routes/pref");
var usersRouter = require("./routes/users");
var xpRouter = require("./routes/xp");
var badgeRouter = require("./routes/badge");
var niveauRouter = require("./routes/niveau");
var notificationRouter = require("./routes/notification");
var messageRouter = require("./routes/message");
var calendarRouter = require("./routes/calendar");

const { default: Message } = require("./models/messageSchema");





//var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(logMiddleware);
app.use(
  session({
    secret: "net attijari secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // À définir sur true si vous utilisez HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie de session (en millisecondes)
    },
  })
);
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials",
    credentials: true,
  })
);

// Debugging: Log current directory path
const currentDirname = path.dirname(__filename);
console.log("Directory path:", currentDirname);

// Serve static files from the 'public/videos' directory
const publicVideosDirectoryPath = path.join(currentDirname, "public/videos");
app.use(express.static(publicVideosDirectoryPath));

// Serve static files from the 'public/files' directory
const publicFilesDirectoryPath = path.join(currentDirname, "public/files");
app.use(express.static(publicFilesDirectoryPath));

// Serve static files from the 'public/images' directory
const publicImagesDirectoryPath = path.join(currentDirname, "public/images");
app.use(express.static(publicImagesDirectoryPath));

// Serve static files from the 'public/records' directory
const publicRecordsDirectoryPath = path.join(currentDirname, "public/records");
app.use(express.static(publicRecordsDirectoryPath));

// Use the upload middleware to handle any type of file
app.use(upload.single("file"));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/pref", prefRouter);
app.use("/xp", xpRouter);
app.use("/badge", badgeRouter);
app.use("/niveau", niveauRouter);
app.use("/notification", notificationRouter);
app.use("/messages", messageRouter);
app.use('/formation', formationRouter);
app.use('/calendar', calendarRouter);

// ...

// Start the server
server.listen(5000, () => {
  connectToMongoDB();
  console.log("app is running on port 5000");
});

module.exports = app;
