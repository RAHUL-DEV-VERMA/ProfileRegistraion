import mongoose from "mongoose";
import validator from "validator";
import plm from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
    },
    emailId: {
      type: String,
      required: [true, "Please Enter Email Id"],
      unique: true,
      validate: validator.default.isEmail,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please Select Your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please Select Your Date of Birth"],
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images",
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
