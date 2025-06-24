const express = require('express');
const router = express.Router();
const { generatePlan, saveAIPlan, getAIPlans,saveManualPlan,getManualPlanner, updateDayInPlanner, deleteAIPlan,addWorkoutToDays} = require('../controllers/exerciseController');

router.post('/generate-plan',generatePlan); // generate a new plan

router.post('/ai-plan', saveAIPlan);
router.get('/ai-plan/:userId', getAIPlans);

router.post('/manual-planner', saveManualPlan);
router.get('/manual-planner/:userId', getManualPlanner);
router.patch('/manual-planner/day', updateDayInPlanner);
router.delete('/ai-plan/:userId/:planId', deleteAIPlan);

router.post('/add', addWorkoutToDays);
module.exports = router;
