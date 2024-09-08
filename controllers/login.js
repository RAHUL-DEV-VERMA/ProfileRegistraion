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
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const newUser = await User({
      firstName,
      lastName,
      emailId,
      gender,
      dob,
    });

    // User.register(newUser, req.body.password).then(function (registereduser) {
    //   passport.authenticate("local")(req, res, function () {
    //     return res.status(200).json({
    //       success: true,
    //       message: "User Created Successfully",
    //     });
    //   });
    // });

    User.register(newUser, password, (err, registeredUser) => {
      if (err) {
        console.log("Error during registration: ", err);
        return res.status(500).json({
          success: false,
          message: "An error occurred during registration",
        });
      };
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
      message: "An error occured during registration",
    });
  }
};

const loginPage = (req, res, next) => {
  // console.log(req.flash("error"));
  res.render("login", {error: req.flash('error')});
};


const userLogin = (req, res, next)=>{
  passport.authenticate("local", {
    successRedirect: "/api/v1/profile",
    failureRedirect: "/api/v1/login",
    failureFlash: true
  }) (req, res, next)
}

export { registrationPage, userRegistraion, loginPage, userLogin };
