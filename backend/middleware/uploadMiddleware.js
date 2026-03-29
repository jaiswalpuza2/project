const multer = require("multer");
const path = require("path");
const fs = require("fs");
const resumeDir = path.join(__dirname, "../uploads/resumes");
const imageDir = path.join(__dirname, "../uploads/images");
const attachmentDir = path.join(__dirname, "../uploads/attachments");
[resumeDir, imageDir, attachmentDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "resume") {
            cb(null, resumeDir);
        } else if (file.fieldname === "profileImage") {
            cb(null, imageDir);
        } else if (file.fieldname === "chatAttachment") {
            cb(null, attachmentDir);
        } else {
            cb(new Error("Invalid field name"), null);
        }
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});
function checkFileType(file, cb) {
    let filetypes;
    if (file.fieldname === "resume") {
        filetypes = /pdf|doc|docx/;
    } else if (file.fieldname === "profileImage") {
        filetypes = /jpeg|jpg|png|gif|webp/;
    } else if (file.fieldname === "chatAttachment") {
        filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|zip|txt/;
    }
    if (!filetypes) {
        return cb(new Error("Invalid field name for file type check"));
    }
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error(`Error: Invalid file type for ${file.fieldname}!`));
    }
}
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
module.exports = upload;
