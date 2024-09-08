import userModel from "../models/user.js"
import imageModel from "../models/image.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const profilePage = async(req, res, next)=>{
    const user = await userModel.findOne({
        emailId: req.session.passport.user
    })
    .populate("images");
    res.render("profile", {user});
}

const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/api/v1/login")
}

const userLogout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/api/v1/login")
    })
}


const profileImage = async(req, res, next)=>{
        const user = await userModel.findOne({emailId: req.session.passport.user})

        const uploadedFile = req.files.image? req.files.image[0] : req.files.file?req.files.file[0]:null;

        if (!uploadedFile) {
            return res.status(400).send('No file uploaded');
        }

        if (user.profileImage) {
            const previousImagePath = path.join(__dirname, "..", "public", "images", "uploads", user.profileImage);
            
            fs.unlink(previousImagePath, (err) => {
                if (err) {
                    console.log("Failed to delete the old profile image:", err);
                } else {
                    console.log("Old profile image deleted successfully");
                }
            });
        }

        user.profileImage = uploadedFile.filename;
        await user.save();
        res.redirect("/api/v1/profile")
}

const uploadFile = async (req,res)=>{
    if (!req.files || (!req.files.file && !req.files.image)) {
        return res.status(400).send('No files were uploaded');
    }

    const uploadedFile = req.files.file ? req.files.file[0] : req.files.image ? req.files.image[0] : null;

    if (!uploadedFile) {
        return res.status(400).send('No files were uploaded');
    }

    const user = await userModel.findOne({emailId: req.session.passport.user});
    const Images = await imageModel.create({
        image:uploadedFile.filename,
        imageNote: req.body.filecaption,
        user: user._id
    })
    user.images.push(Images._id);
    await user.save();
    res.redirect("/api/v1/profile");
}

const updateProfile = async (req, res) => {
    const { firstName, lastName, emailId, dob, gender, mobile, countryCode, address, additionalDetails } = req.body;

    try {
        // Find the user by email ID
        const user = await userModel.findOne({ emailId: req.session.passport.user });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (emailId) user.emailId = emailId; 
        if (dob) user.dob = new Date(dob);
        if (gender) user.gender = gender;
        if (mobile) user.mobile = mobile;
        if (countryCode) user.countryCode = countryCode;
        if (address) user.address = address;

        await user.save();
        res.redirect("/api/v1/profile");
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Internal Server Error");
    }
};


export {profilePage, isLoggedIn, userLogout, uploadFile, profileImage, updateProfile};
