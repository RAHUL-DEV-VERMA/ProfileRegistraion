import express from "express";
import { getSelectProfile, postSelectProfile } from "../controllers/profileSection.js";
import { isLoggedIn } from "../controllers/profile.js";


const router = express.Router();
router.get("/selectProfile",isLoggedIn, getSelectProfile);
  
router.post("/selectProfile",isLoggedIn, postSelectProfile);

export default router;