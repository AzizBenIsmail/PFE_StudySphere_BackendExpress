const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/Badges')
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  }
})

var uploadBadges = multer({ storage: storage });
module.exports = uploadBadges;
