const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Xcl');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var uploadXcl = multer({ storage: storage });

module.exports = uploadXcl;
