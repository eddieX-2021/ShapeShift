const express = require('express');
const router = express.Router();
const { checkIntakeToday, submitIntake,getLatesetWeight } = require('../controllers/intakeController');

router.get('/check', checkIntakeToday);   // check if today's entry exists
router.post('/submit', submitIntake);     // submit new intake
router.get('/latest-weight',getLatesetWeight); // get latest weight entry

module.exports = router;
