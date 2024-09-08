import multer from "multer";
import {v4 as uuid} from "uuid";

const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, "./public/images/uploads");
    },
    filename(req, file, callback){
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        const fileName =  `${id}.${extName}`
        callback(null, fileName);
    }
});


// export const singleUpload = multer({storage}).single("file");
export const singleUpload = multer({storage}).fields([
    {name: "file", maxCount:1},
    {name: "image", maxCount: 1}
]);
