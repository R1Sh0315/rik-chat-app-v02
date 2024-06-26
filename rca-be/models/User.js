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
  requests: { type: [String], default: [] },
});

// Define a schema and model for chat messages
const messageSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Group = mongoose.model("Group", groupSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Group, Message };
