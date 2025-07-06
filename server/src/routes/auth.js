// routes/auth.js
require('dotenv').config();
const express       = require('express');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');
const User          = require('../models/user');
const router        = express.Router();

const JWT_SECRET    = process.env.JWT_SECRET;
const { SMTP_USER, SMTP_PASS, CLIENT_URL } = process.env;

// ── Configure a single nodemailer transporter ───────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    // only disable in dev if you run into cert errors
    rejectUnauthorized: false
  }
});

// ── Register ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashed });
  await user.save();

  const { password: pw, ...userData } = user.toObject();
  res.status(201).json({ msg: 'User registered successfully', user: userData });
});

// ── Login ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ error: 'Wrong password' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000, // 2h
  });
  res.json({ message: 'Logged in successfully' });
});

// ── Current User ─────────────────────────────────────────────────────────────
router.get('/user', async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
});

// ── Forgot Password ──────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  // 1) generate & store one-time token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken   = token;
  user.resetPasswordExpires = Date.now() + 3600_000; // 1hr
  await user.save();

  // 2) build the link (you might inject your front-end URL via CLIENT_URL env var)
  const resetUrl = `${CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  // 3) send the e-mail
  await transporter.sendMail({
    from:    SMTP_USER,
    to:      user.email,
    subject: 'Reset password link',
    html:    `<p>Click <a href="${resetUrl}" target="_blank">here</a> to reset your password.</p>`
  });

  // 4) return the link in the JSON payload (your page.tsx will `setMsg(res.data.message)`)
  res.json({ message: resetUrl });
});

// ── Reset Password ───────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password required' });
  }

  const user = await User.findOne({
    resetPasswordToken:   token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password               = await bcrypt.hash(password, salt);
  user.resetPasswordToken     = undefined;
  user.resetPasswordExpires   = undefined;
  await user.save();

  res.json({ message: 'Password has been reset' });
});

module.exports = router;
