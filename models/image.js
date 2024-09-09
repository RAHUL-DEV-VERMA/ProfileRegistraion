import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageNote: {
      type: String,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const image = mongoose.model("Images", imageSchema);

export default image;
