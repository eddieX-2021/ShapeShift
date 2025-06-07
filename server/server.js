require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();
app.use (cookieParser());
app.use(cors({
    origin:['http://localhost:3000/', 'https://localhost:8080',"https://localhost:4200"],
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));

const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));