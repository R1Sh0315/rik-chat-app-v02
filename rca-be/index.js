const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const crypto = require("crypto");
const cors = require("cors");

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

const mongoURI =
  "mongodb+srv://rca-db:dxlsJkqDEn97rbV7@rca-cluster-01.gv1rhud.mongodb.net/";
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
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
