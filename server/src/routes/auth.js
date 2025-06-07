const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user =  new User({
        name: req.body.name,
        email: req.body.email,  
        password: hashedPassword,
    })
    const result = await user.save();
    const {password, ...data}= await result.toJSON();
    res.send(data)
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ token });
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
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  // res.cookie('jwt', '', { maxAge: 0 }); // Clear the cookie  what is the difference between this and the above line?
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;