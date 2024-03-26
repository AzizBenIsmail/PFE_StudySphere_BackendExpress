const multer = require("multer");
const fs = require("fs");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/Formations')
  },
  filename: function (req, file, cb) {
    const uploadPath = 'public/images/Formations';
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    let fileName = originalName;

    // Vérifier si le fichier existe déjà
    let fileIndex = 1;
    while (fs.existsSync(path.join(uploadPath, fileName))) {
      const baseName = path.basename(originalName, fileExtension);
      fileName = `${baseName}_${fileIndex}${fileExtension}`;
      fileIndex++;
    }

    cb(null, fileName);
  }
});

var uploadBadges = multer({ storage: storage });

module.exports = uploadBadges;
