import mongoose from "mongoose";
// scheman för user + validering
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // konverterar strängen till små bokstäver
      trim: true, // tar automatiskt bort mellanslag före och efter en sträng
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // kan vara antingen user eller admin
      default: "user", // sätter role user till default
    },
  },
  { timestamps: true }
); // lägger till createdAt & updated at

const User = mongoose.model("User", userSchema);

export default User;
