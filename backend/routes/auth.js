const express = require("express");
const router = express.Router();
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const hashPassword = require("../utils/bcrypt-hash");
const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const authenticateToken = require("../middleware/auth");
//register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.log("ADMIN_EMAIL is missing in .env");
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }
  try {
    const role = await Role.findOne({
      name: email === ADMIN_EMAIL ? "admin" : "user",
    });
    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      roleId: role._id,
    });
    const savedNewUser = await newUser.save();
    const payload = {
      userId: savedNewUser._id,
      name: savedNewUser.name,
      email: savedNewUser.email,
      roleId: savedNewUser.roleId,
    };

    if (!savedNewUser) {
      return res.status(400).json({ message: "Failed to register" });
    }
    const jti = uuidv4();
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken({ ...payload, jti: jti });
    const newRefreshTokenDoc = new RefreshToken({
      userId: savedNewUser._id,
      token: refreshToken,
      jti: jti,
      expiresAt: new Date(Date.now() + 86400000),
    });
    const savedRefreshTokenDoc = await newRefreshTokenDoc.save();
    if (!savedRefreshTokenDoc) {
      return res
        .status(400)
        .json({ message: "Failed to create refresh token" });
    }

    res.status(201).json({
      message: "User registered",
      user: savedNewUser,
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//login route

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(401).json({ message: "Password is required" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const jti = uuidv4();
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken({ ...payload, jti: jti });
    const newRefreshTokenDoc = new RefreshToken({
      userId: user._id,
      token: refreshToken,
      jti: jti,
      expiresAt: new Date(Date.now() + 86400000),
    });
    const savedRefreshTokenDoc = await newRefreshTokenDoc.save();
    if (!savedRefreshTokenDoc) {
      return res
        .status(400)
        .json({ message: "Failed to create refresh token" });
    }
    res.status(201).json({
      message: "Login Success",
      tokens: { accessToken: accessToken, refreshToken: refreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
//get new access token route
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh Token Required" });
  }
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    return res.status(400).json({ message: "Refresh Token is invalid" });
  }
  try {
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      jti: decoded.jti,
    });
    if (!storedToken) {
      return res
        .status(400)
        .json({ message: "Refresh token not found in the DB" });
    }
    const deletedRefreshToken = await RefreshToken.findOneAndDelete(
      storedToken
    );

    if (!deletedRefreshToken) {
      return res
        .status(400)
        .json({ message: "Failed to delete Old Refresh Token" });
    }
    const jti = uuidv4();
    const payload = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      roleId: decoded.roleId,
    };
    const newAccessToken = createAccessToken(payload);
    const newRefreshToken = createRefreshToken({ ...payload, jti: jti });

    const newRefreshTokenDoc = new RefreshToken({
      userId: decoded.userId,
      token: newRefreshToken,
      jti: jti,
      expiresAt: new Date(Date.now() + 86400000),
    });
    const savedRefreshTokenDoc = await newRefreshTokenDoc.save();
    if (!savedRefreshTokenDoc) {
      return res.status(400).json({ message: "Failed to save refresh token" });
    }
    res.status(201).json({
      message: "Successfully Refreshed",
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// get current user route

router.get("/me", authenticateToken, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
