// routes/dietRoutes.js
const express = require('express');
const c = require('../controllers/dietController');
const foodCtrl = require('../controllers/foodController');
const router = express.Router();

router.post   ('/generate',     c.generateDietPlan);
router.post   ('/plan',         c.saveDietPlan);
router.get    ('/plans',        c.listDietPlans);
router.delete ('/plan',         c.deleteDietPlan);
router.post   ('/plan/apply',   c.applyDietPlanToToday);

router.get    ('/meals/today',  c.getTodayMeals);
router.get    ('/nutrition',    c.getDietNutrition);
router.post('/meal/add',         c.addMealFromSearch);
router.delete ('/meal',         c.deleteMealItem);
router.post   ('/meal/custom',  c.addCustomMeal);

router.get  ('/meal/suggestions', c.searchMealSuggestions);
router.post ('/meal/search',      c.searchMeal);

router.post('/scan', foodCtrl.scanFood);
router.post('/plan/apply-generated', c.applyGeneratedPlan);

module.exports = router;
