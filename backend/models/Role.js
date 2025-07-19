const mongoose = require("mongoose");
const { Schema } = mongoose;

const role = new Schema({
  name: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  displayName: {
    type: String,
    default: function () {
      return this.name === "user" ? "User" : "Administrator";
    },
  },

  permission: {
    type: [String],
    default: function () {
      return this.name === "user"
        ? ["task:create", "task:read", "task:update", "task:delete"]
        : ["task:read:all", "user:manage", "system:admin"];
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Role = mongoose.model("Role", role);
module.exports = Role;
