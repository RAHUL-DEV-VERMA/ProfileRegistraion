import express from "express";
import { userRegistraion, registrationPage, loginPage, userLogin } from "../controllers/login.js";

const router = express.Router();

router.get("/register", registrationPage);

router.post("/register", userRegistraion);

router.get("/login", loginPage);

router.post("/login", userLogin);


export default router;
