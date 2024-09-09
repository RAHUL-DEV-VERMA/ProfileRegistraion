

import mongoose from "mongoose";
import validator from "validator";
import plm from "passport-local-mongoose";

// Profile schema for multiple profiles under one user
const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please Enter Your First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your Last Name"],
  },
  dob: {
    type: Date,
    required: [true, "Please Select Your Date of Birth"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Please Select Your Gender"],
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images",
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images", // Assuming documents and images are stored in the same model
    },
  ],
  profileImage: {
    type: String,
  },
  mobile: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  address: {
    type: String,
  },
  postCode: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: [true, "Please Enter Email Id"],
      unique: true,
      validate: validator.default.isEmail,
    },
    profiles: [profileSchema], // Multiple profiles under one email ID
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(plm, {
  usernameField: "emailId",
});

const user = mongoose.model("Users", userSchema);

export default user;
