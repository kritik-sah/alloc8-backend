import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    referralCode: {
      type: String,
      default: "",
      unique: true,
    },
    referredBy: {
      type: String,
      default: "",
    },
    referredUsers: {
      type: Array,
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
