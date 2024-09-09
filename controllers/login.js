import passport from "passport";
import User from "../models/user.js";

import {Strategy as LocalStrategy} from "passport-local";
passport.use(new LocalStrategy({usernameField: "emailId"},User.authenticate()));

const registrationPage = (req, res, next) => {
  res.render("register");
};

const userRegistraion = async (req, res, next) => {
  try {
    const { firstName, lastName, emailId, gender, dob, password } = req.body;

    if (!firstName || !lastName || !emailId || !gender || !dob || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill all fields",
      });
    }

    let user = await User.findOne({ emailId });

    if (user) {

       // Check if the user already has two profiles
       if (user.profiles.length >= 2) {
        return res.status(400).json({
          success: false,
          message: "You have reached the maximum of 2 profiles for this email ID.",
        });
      }

      // Check if a profile with the same firstName, lastName, and dob already exists
      const existingProfile = user.profiles.find(
        (profile) =>
          profile.firstName === firstName &&
          profile.lastName === lastName &&
          profile.dob.toISOString() === new Date(dob).toISOString()
      );

      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this profile",
        });
      }

      // Add new profile
      user.profiles.push({
        firstName,
        lastName,
        gender,
        dob,
        mobile: req.body.mobile || "",
        countryCode: req.body.countryCode || "",
        address: req.body.address || "",
      });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Profile added successfully",
      });
    }

    // Create a new user with the first profile
    const newUser = new User({
      emailId,
      profiles: [
        {
          firstName,
          lastName,
          gender,
          dob,
          mobile: req.body.mobile || "",
          countryCode: req.body.countryCode || "",
          address: req.body.address || "",
        },
      ],
    });

    User.register(newUser, password, (err, registeredUser) => {
      if (err) {
        console.log("Error during registration: ", err);
        return res.status(500).json({
          success: false,
          message: "An error occurred during registration",
        });
      }
      passport.authenticate("local")(req, res, () => {
        return res.status(200).json({
          success: true,
          message: "User registered Successfully",
        });
      });
    });
  } catch (error) {
    console.log("Unhandled error: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

const loginPage = (req, res, next) => {
  // console.log(req.flash("error"));
  res.render("login", {error: req.flash('error')});
};


const userLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/api/v1/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // If multiple profiles exist, redirect to profile selection page
      if (user.profiles.length > 1) {
        return res.redirect("/api/v1/selectProfile");
      } else {
        // If only one profile exists, proceed to the dashboard
        req.session.selectedProfile = user.profiles[0]._id;
        return res.redirect("/api/v1/profile");
      }
    });
  })(req, res, next);
};

export { registrationPage, userRegistraion, loginPage, userLogin };
