import express from "express";
import { fileUpload } from "../middleware/multer.js";
import { isLoggedIn, profileImage, profilePage, updateProfile, uploadFile, userLogout } from "../controllers/profile.js";

const router = express.Router();

router.get("/profile" ,isLoggedIn, profilePage);

router.get("/logout", userLogout);

router.post("/profileUpload", isLoggedIn, fileUpload('profile-image'), profileImage);

router.post("/upload", isLoggedIn, fileUpload('post-image'), uploadFile);

router.post("/updateProfile", isLoggedIn, updateProfile);

export default router;