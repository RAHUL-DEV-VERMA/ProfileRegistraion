import multer from "multer";
import { v4 as uuid } from "uuid";

// Define a storage engine with dynamic file name handling
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/images/uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    callback(null, fileName);
  },
});

// Export a dynamic file upload handler
export const fileUpload = (fieldName) => {
  return multer({ storage }).single(fieldName);
};
