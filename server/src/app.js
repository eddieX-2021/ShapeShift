const express = require('express');
const app = express();

const intakeRoutes = require('./routes/intake');
const cors = require('cors');


app.use(cors());
app.use(express.json()); // parse JSON body
app.use('/api/intake', intakeRoutes); // mount intake routes

module.exports = app;