const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profilePicture') {
            cb(null, './uploads/profiles/');
        } else if (file.fieldname === 'logo') {
            cb(null, './uploads/logos/');
        } else {
            cb(null, './uploads/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|svg|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only! (JPEG, JPG, PNG, GIF, SVG, WEBP)');
    }
}

// Init upload
const imageUpload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = imageUpload;
