const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
const http = require("http");

//socket for chat
const socketIo = require("socket.io");
const { Server } = require("socket.io");

const { User, Group, Message } = require("./models/User");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3030;

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const generateJWTSecret = () => {
  console.log("7 : ", crypto.randomBytes(32).toString("hex"));
  return crypto.randomBytes(32).toString("hex");
};

const userNameGen = (str) => {
  const userHash = crypto.createHash("sha256").update(str).digest("hex");
  return "#" + userHash.substring(0, 8);
};
app.use(bodyParser.json());

const JWT_SECRET = generateJWTSecret();

// const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(
    "mongodb+srv://rca-db:dxlsJkqDEn97rbV7@rca-cluster-01.gv1rhud.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(cors());
// app.use(
//   cors({
//     origin: ["https://rik-chat-app-v02-fe-01.vercel.app"],
//     methods: ["POST", "GET"],
//     credentials: true,
//   })
// );

app.get("/", (req, res) => {
  res.json("BE successfully hosted");
});

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
  const grpType = needAdminAccess ? "private" : "global";
  try {
    const newGroup = new Group({
      name,
      owner,
      needAdminAccess,
      grpType: grpType,
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
  try {
    const groups = await Group.find({
      owner: "#" + owner,
      requests: { $exists: true, $not: { $size: 0 } },
    }).select("requests name _id");

    // Debugging: Check if groups are found

    const formattedGroups = groups.map((group) => {
      return {
        groupId: group._id,
        groupName: group.name,
        requests: group.requests,
      };
    });

    res.status(200).json(formattedGroups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST endpoint to accept membership request
app.post("/groups/accept-request", async (req, res) => {
  const { groupId, username } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Add the username to the group's members list
    group.members.push(username);

    // Remove the request from the group's requests list


    group.requests = group.requests.filter((request) => {
      request !== username;
    });

    // Save the updated group
    await group.save();

    res.status(200).json({
      message: "Membership request accepted and removed from requests list",
    });
  } catch (error) {
    console.error("Error accepting membership request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/groups/add-member", async (req, res) => {
  const { groupId, username } = req.body;

  try {
    const group = await Group.findOne({ name: groupId });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(username)) {
      group.members.push(username);
      await group.save();
    } else {
      return res.status(400).json({ message: "User is already a member" });
    }

    res.status(200).json({ message: "User added to the group" });
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/users/search', async (req, res) => {
  const query = req.query.q;

  try {
    const users = await User.find({ username: new RegExp(query, 'i') }).select('username'); // Adjust this query based on your user schema
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch chat history
app.get("/groups/:groupId/messages", async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { groupId, username, message } = data;
    const newMessage = new Message({ groupId, username, message });
    await newMessage.save();
    io.to(groupId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
