import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  nickname: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
