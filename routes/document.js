import express from "express";
import { fileUpload } from "../middleware/multer.js";
import { uploadDocument, documentPage } from "../controllers/document.js";
import {isLoggedIn} from "../controllers/profile.js"

const router = express.Router();

// Route for document upload page
router.get('/document',isLoggedIn, documentPage);

// Route for handling document upload
router.post('/upload-document', fileUpload('document'), uploadDocument);

export default router;
