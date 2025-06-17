//app is for main server file
const app = require('./src/app');
//this is for database
const mongoose = require('mongoose');
//connecting to the database
const connectDB = require('./src/config/db');



const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));