
import multer from "multer";
import { fileFilter } from "../config/aws.js";
 
const storage = multer.memoryStorage();
 
const uplodeFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});
 
export default uplodeFile;
