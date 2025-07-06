require('dotenv').config();
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
const homeRoutes     = require("./routes/homeRoutes");
const authRoutes = require('./routes/auth');
const intakeRoutes = require('./routes/intake');
const exerciseRoutes = require('./routes/exercise');
const dietRoutes = require('./routes/diet');
const stripeRoutes = require('./routes/stripe');
const feedbackRoutes = require('./routes/feedback');


app.use('/api/home',          homeRoutes);
app.use('/api/intake', intakeRoutes); // mount intake routes
app.use('/api/auth', authRoutes);
app.use('/api/exercise', exerciseRoutes); // mount exercise routes
app.use('/api/diet', dietRoutes); // mount diet routes
app.use('/api/stripe', stripeRoutes); // mount Stripe routes
app.use('/api/feedback', feedbackRoutes); // mount feedback routes



module.exports = app;