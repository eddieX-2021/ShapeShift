const router = require("express").Router();
const home   = require("../controllers/homeController");

// Weight & body-fat
router.get("/weight-data",   home.getWeightData);
router.get("/body-fat-data", home.getBodyFatData);

// Intake/BMI
router.get("/intake/today",  home.getTodayIntake);

// Exercise
router.get("/exercise/today",     home.getTodayExercises);
router.post("/exercise/complete", home.completeExercise);
// Diet
router.get("/diet/meals/today", home.getTodayMeals);
router.get("/diet/nutrition",   home.getNutrition);
module.exports = router;
