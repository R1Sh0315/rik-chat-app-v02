const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");

const { User, Group } = require("./models/User");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3030;

const generateJWTSecret = () => {
  console.log("7 : ", crypto.randomBytes(32).toString("hex"));
  return crypto.randomBytes(32).toString("hex");
};

const userNameGen = (str) => {
  const userHash = crypto.createHash("sha256").update(str).digest("hex");
  return "#" + userHash.substring(0, 8);
};

const JWT_SECRET = generateJWTSecret();

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(bodyParser.json());
app.use(cors());

// Signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: userNameGen(password),
      email,
      password: hashPassword,
    });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("Username", userNameGen(password));
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// Create Group Endpoint
app.post("/groups", async (req, res) => {
  const { name, owner, needAdminAccess } = req.body;
  try {
    const newGroup = new Group({
      name,
      owner,
      needAdminAccess,
      members: [owner],
    });
    console.log("Group Data >>>", newGroup);
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Groups Endpoint
app.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//post to join group
app.post("/groups/join", async (req, res) => {
  const { groupId, username } = req.body;
  console.log(groupId, username, "<<<<<<");
  try {
    const group = await Group.findById(groupId);
    console.log(group, "<<<<<<");
    if (!group.members.includes(username)) {
      group.members.push(username);
      await group.save();
    }
    console.log(">>>>> OK");
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Post to request access to join a group
app.post("/groups/request", async (req, res) => {
  const { groupId, username } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (
      !group.requests.includes(username) &&
      !group.members.includes(username)
    ) {
      group.requests.push(username);
      await group.save();
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all group join requests for a specific user
app.get("/groups/requests/:owner", async (req, res) => {
  const { owner } = req.params;
  console.log('#'+owner)
  try {
    const groups = await Group.find({
      owner: '#'+owner,
      requests: { $exists: true, $not: { $size: 0 } },
    });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
