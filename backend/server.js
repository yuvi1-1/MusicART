const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const musicRoutes = require("./routes/musicRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MusicART backend is running");
});

app.use("/api/music", musicRoutes);
app.use("/api/auth", authRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5050;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});