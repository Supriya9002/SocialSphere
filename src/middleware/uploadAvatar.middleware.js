import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure destination directory exists
const uploadDir = "./AvatarPhoto/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with current timestamp and original extension
  },
});

// Define file filter - accept any image mime type (including webp/avif)
const fileFilter = function (req, file, cb) {
  console.log("In Middleware Avatar: ", file);
  if (file && file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer middleware with options
const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limits
  fileFilter: fileFilter,
}); // don't call .single here; call in the route

export default uploadAvatar;
