import multer from 'multer';
import path from 'path';

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './AvatarPhoto/') // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with current timestamp and original extension
  }
});

// Define file filter
const fileFilter = function (req, file, cb) {
  console.log("In Middleware Avatar: ",file);
  // Accept only JPEG, JPG, and PNG files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') { 
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed!'), false);
  }
};


// Initialize multer middleware with options
const uploadAvatar = multer(
    { 
        storage: storage,
        limits: {fileSize: 2000000}, //2MB limits 
        fileFilter: fileFilter 
    }
) //.single('avatar'); // 'avatar' should be the name attribute of the file input in your form

export default uploadAvatar;