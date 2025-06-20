const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true
}));
app.use(express.json()); // parse JSON body

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/auth');
const intakeRoutes = require('./routes/intake');


app.use('/api/intake', intakeRoutes); // mount intake routes
app.use('/api/auth', authRoutes);


module.exports = app;