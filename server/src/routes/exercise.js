const express = require('express');
const router = express.Router();
const { generatePlan, searchExercises } = require('../controllers/exerciseController');

router.post('/generate-plan',generatePlan); // generate a new plan
router.post('/search-exercises', searchExercises);     // submit new intake

module.exports = router;
