const mongoose = require("mongoose");

// New user Schema and Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Group Schema and Model
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  needAdminAccess: { type: Boolean, default: false },
  grpType: { type: String, required: true },
  members: { type: [String], default: [] },
  requests: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      username: { type: String, required: true },
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Group = mongoose.model("Group", groupSchema);

module.exports = { User, Group };
