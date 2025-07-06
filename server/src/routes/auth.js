const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const router = express.Router();
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ error: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user =  new User({
        name,
        email,  
        password: hashedPassword,
    })
    const result = await user.save();
    const { password: pw, ...userData } = result. toJSON();
    res.status(201).json({ msg: 'User registered successfully', user: userData });
    // const {password, ...data}= await result.toJSON();
    // res.send(data)
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hr
    });
    res.send({ message: 'Logged in successfully'});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/user', async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // send back exactly the fields your frontend needs
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  // res.cookie('jwt', '', { maxAge: 0 }); // Clear the cookie  what is the difference between this and the above line?
  res.json({ message: 'Logged out successfully' });
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: 'User not found' })

  // Generate a one-time token valid for 1h
  const token = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = token
  user.resetPasswordExpires = Date.now() + 3600_000
  await user.save()

  // Send email with reset link
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`
 // Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5806a906db8c16",
    pass: "b3fd52e7415845"
  }
});

  await transporter.sendMail({
    to: user.email,
    subject: 'ShapeShift Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to set a new password.</p>`
  })

  res.json({ message: 'Reset link sent' })
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' })

  // Hash & overwrite
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  res.json({ message: 'Password has been reset' })
})

module.exports = router;