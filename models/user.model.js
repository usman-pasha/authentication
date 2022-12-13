const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("strictQuery", false);

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, lowercase: true },
    emailisVerified: { type: Boolean, default: false },
    emailOTP: { type: Number },
    phoneNumber: { type: String },
    accountType: { type: String, default: "user" },
    accessLevel: [{ type: Schema.Types.String }],
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["inactive", "active", "deleted"],
    },
    profilePicture: { type: String },
    forgotPasswordToken: { type: String },
    resetPasswordExpire: { type: String },
    createdBy: { type: String, required: true, default: "system" },
    updatedBy: { type: String, required: true, default: "system" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
