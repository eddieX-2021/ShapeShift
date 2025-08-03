require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');




const connectDB = require('./config/db');
connectDB();


const app = express();

// Read your primary front-end URL (production) and the current Vercel preview URL:
const PROD_URL    = (process.env.CLIENT_URL || '').replace(/\/$/, '');
const VERCEL_URL  = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : null;

// Build an array of allowed origins:
const allowedOrigins = [PROD_URL];
if (VERCEL_URL) allowedOrigins.push(VERCEL_URL);

// CORS middleware:
app.use(cors({
  origin: (incomingOrigin, callback) => {
    // Allow no-origin requests (e.g. cURL) or any of our hosts
    if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
      callback(null, true);
    } else {
      console.warn('Blocked CORS from', incomingOrigin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

app.use(express.json());

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
