const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const router = express.Router();

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
    const { password: pw, ...userData } = user.toObject();
    res.json(userData);
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