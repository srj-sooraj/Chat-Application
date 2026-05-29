import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    appID: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;