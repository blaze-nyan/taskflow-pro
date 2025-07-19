const express = require("express");
const mongoose = require("mongoose");
//routes
const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const adminRoute = require("./routes/admin");
//seed
const seedRole = require("./db/seeds/role");
//middleware
const roleCheck = require("./middleware/role");
const authenticateToken = require("./middleware/auth");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 5500;
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedRole();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectDB();
//root route
app.get("/", (req, res) => {
  res.send("Welcome to TaskFlow Pro API!");
});

//task route
app.use("/api/task", authenticateToken, roleCheck("user"), taskRoute);
//auth route
app.use("/api/auth", authRoute);
app.use("/api/admin", authenticateToken, roleCheck("admin"), adminRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
