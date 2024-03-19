const multer = require("multer");

// Multer configuration for handling any type of file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check the file type and set the destination accordingly
    if (file.mimetype.startsWith('image')) {
      cb(null, 'public/images/');
    } else if (file.mimetype.startsWith('video')) {
      cb(null, 'public/videos/');
    } else {
      cb(null, 'public/files/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

module.exports.upload = multer({ storage: storage });
