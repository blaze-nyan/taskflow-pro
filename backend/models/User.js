const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  createdAt: Date,
  refreshToken: { type: String, createdAt: Date.now, expiresIn: 172800000 },
});

const User = mongoose.model("User", user);
module.exports = User;
