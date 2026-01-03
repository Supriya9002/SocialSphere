import multer from "multer";
import { fileFilter } from "../config/aws.js";

const storage = multer.memoryStorage();

// Initialize multer middleware with options
const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: fileFilter,
}); // don't call .single here; call in the route
 
export default uploadAvatar;
