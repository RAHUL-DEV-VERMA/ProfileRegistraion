import userModel from "../models/user.js";
import imageModel from "../models/image.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profilePage = async (req, res, next) => {
  try {
    const user = await userModel
      .findOne({ emailId: req.session.passport.user })
      .populate({
        path: "profiles.images",
        model: "Images",
      });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const selectedProfileId = req.session.selectedProfile;
    const selectedProfile = user.profiles.id(selectedProfileId);

    if (!selectedProfile) {
      return res.status(404).send("Profile not found");
    }

    res.render("profile", { user, selectedProfile });
  } catch (err) {
    console.error("Error loading profile page:", err);
    res.status(500).send("Internal Server Error");
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/v1/login");
};

const userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/api/v1/login");
  });
};

// Profile image upload handler
const profileImage = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ emailId: req.session.passport.user });
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).send("No file uploaded");
    }

    const selectedProfileId = req.session.selectedProfile;
    const profile = user.profiles.id(selectedProfileId);

    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    if (profile.profileImage) {
      const previousImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "uploads",
        profile.profileImage
      );
      fs.unlink(previousImagePath, (err) => {
        if (err) {
          console.log("Failed to delete the old profile image:", err);
        } else {
          console.log("Old profile image deleted successfully");
        }
      });
    }

    profile.profileImage = uploadedFile.filename;
    await user.save();
    res.redirect("/api/v1/profile");
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).send("Internal Server Error");
  }
};

// File upload handler for other types of files (e.g., documents)
const uploadFile = async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).send("No file uploaded");
    }

    const user = await userModel.findOne({ emailId: req.session.passport.user });
    const selectedProfileId = req.session.selectedProfile;
    const profile = user.profiles.id(selectedProfileId);

    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    const image = await imageModel.create({
      image: uploadedFile.filename,
      imageNote: req.body.filecaption,
      user: user._id,
    });

    profile.images.push(image._id);
    await user.save();
    res.redirect("/api/v1/profile");
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Profile update handler
const updateProfile = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/api/v1/login");
    }

    const { firstName, lastName, dob, gender, mobile, countryCode, address, postCode } = req.body;
    const userId = req.user._id;
    const selectedProfileId = req.session.selectedProfile;

    // Retrieve user and selected profile from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const selectedProfile = user.profiles.id(selectedProfileId);

    if (!selectedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update the profile fields
    selectedProfile.firstName = firstName || selectedProfile.firstName;
    selectedProfile.lastName = lastName || selectedProfile.lastName;
    selectedProfile.dob = dob || selectedProfile.dob;
    selectedProfile.gender = gender || selectedProfile.gender;
    selectedProfile.mobile = mobile || selectedProfile.mobile;
    selectedProfile.countryCode = countryCode || selectedProfile.countryCode;
    selectedProfile.address = address || selectedProfile.address;
    selectedProfile.postCode = postCode || selectedProfile.postCode;

    await user.save();
    res.redirect("/api/v1/profile");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal Server Error");
  }
};

export {
  profilePage,
  isLoggedIn,
  userLogout,
  uploadFile,
  profileImage,
  updateProfile,
};
