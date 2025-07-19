const mongoose = require("mongoose");
const { Schema } = mongoose;

const refreshToken = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  jti: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 },
  },
});

refreshToken.index({ userId: 1, jti: 1 }, { unique: true });

const RefreshToken = mongoose.model("RefreshToken", refreshToken);
module.exports = RefreshToken;
