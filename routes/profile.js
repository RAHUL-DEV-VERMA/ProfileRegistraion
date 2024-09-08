import express from "express";
import { singleUpload } from "../middleware/multer.js";
import { isLoggedIn, profileImage, profilePage, updateProfile, uploadFile, userLogout } from "../controllers/profile.js";

const router = express.Router();

router.get("/profile" ,isLoggedIn, profilePage);

router.get("/logout", userLogout);

router.post("/profileUpload", isLoggedIn, singleUpload, profileImage);

router.post("/upload", isLoggedIn, singleUpload, uploadFile);

router.post("/updateProfile", isLoggedIn, updateProfile);

export default router;