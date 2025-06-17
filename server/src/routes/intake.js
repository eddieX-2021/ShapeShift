const express = require('express');
const router = express.Router();
const { checkIntakeToday, submitIntake } = require('../controllers/intakeController');

router.get('/check', checkIntakeToday);   // check if today's entry exists
router.post('/submit', submitIntake);     // submit new intake

module.exports = router;
