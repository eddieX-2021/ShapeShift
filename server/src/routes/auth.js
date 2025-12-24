require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("./models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const { SMTP_USER, SMTP_PASS, CLIENT_URL, NODE_ENV } = process.env;

const isProd = NODE_ENV === "production";

// ── Configure a single nodemailer transporter ───────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: false }, // ok in dev
});

// Helper: sign token with useful payload (so /user can be DB-free)
function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Helper: cookie options
function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd, // must be true when sameSite=none
    maxAge: 2 * 60 * 60 * 1000, // 2h
    path: "/",
  };
}

// ── Register ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password required." });
    }

    // strong password (you already had this idea):contentReference[oaicite:3]{index=3}
    const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPwd.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ error: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email: normalizedEmail, password: hashed });
    await user.save();

    // IMPORTANT: your uploaded auth.js had a broken line here (`const { password: pw, .userData } ...`):contentReference[oaicite:4]{index=4}
    // Return safe user object
    const userSafe = { _id: user._id, name: user.name, email: user.email };

    return res.status(201).json({
      msg: "User registered successfully",
      user: userSafe,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during registration." });
  }
});

// ── Login ───────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = (email || "").toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(400).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Wrong password" });

    // put user info in the JWT payload so /user is fast
    const token = signAuthToken(user);

    res.cookie("jwt", token, authCookieOptions());
    return res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during login." });
  }
});

// ── Current User (FAST: no DB call) ─────────────────────────────────────────
// Before: verified token then did `User.findById(userId)`:contentReference[oaicite:5]{index=5}
// Now: verify + return token payload
router.get("/user", (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({
      _id: payload.userId,
      name: payload.name,
      email: payload.email,
    });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// ── Logout ──────────────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

// ── Forgot Password (keep your existing logic) ──────────────────────────────
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(400).json({ error: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600_000;
  await user.save();

  const resetUrl = `${CLIENT_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: SMTP_USER,
    to: user.email,
    subject: "Reset password link",
    html: `<p>Click <a href="${resetUrl}" target="_blank">here</a> to reset your password.</p>`,
  });

  res.json({ message: resetUrl });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password required" });
  }

  const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPwd.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
    });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset" });
});

module.exports = router;
