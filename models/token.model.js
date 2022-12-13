const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    jwtToken: { type: String },
    refreshToken: { type: String },
    createdByIp: { type: String },
    status: {
      type: Number,
      required: true,
      default: 0, //0:active, 1:inactive
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("token", tokenSchema);
