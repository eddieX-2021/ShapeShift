const { searchMeal } = require('../utils/mealSearch');
const { generateDietPlan: _gen } = require('../utils/generateDietPlan');
// const { analyzeImageNutrition } = require('../utils/foodScanner');
// const { searchMeal } = require('../utils/mealSearch');
const DietPlan   = require('../models/UserDiet');
const DailyMeal  = require('../models/DailyMeal');
const moment = require('moment');
const axios = require('axios');

//generate diet plan
exports.generateDietPlan = async (req, res) => {
  try {
    const { goal, description, dietRestriction } = req.body;
    const { cycleName, meals } = await _gen({ goal, description, dietRestriction });
    res.json({ cycleName, meals });
  } catch (err) {
    console.error("generateDietPlan error:", err);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
};
exports.saveDietPlan = async (req, res) => {
  try {
    const { userId, cycleName, meals } = req.body;
    await DietPlan.create({ userId, cycleName, meals });
    const plans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    res.status(201).json({ plans });
  } catch (err) {
    console.error("saveDietPlan error:", err);
    res.status(500).json({ error: "Failed to save diet plan" });
  }
};
exports.listDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.query.userId }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (err) {
    console.error("listDietPlans error:", err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};
exports.deleteDietPlan = async (req, res) => {
  try {
    const { userId, index } = req.body;
    const plans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    if (!plans[index]) return res.status(404).json({ error: "Plan not found" });
    await DietPlan.deleteOne({ _id: plans[index]._id });
    const remaining = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    res.json({ plans: remaining });
  } catch (err) {
    console.error("deleteDietPlan error:", err);
    res.status(500).json({ error: "Failed to delete plan" });
  }
};

exports.applyGeneratedPlan = async (req, res) => {
  try {
    const { userId, meals } = req.body;                  // meals is the generated Meals object
    const date = moment().format('YYYY-MM-DD');

    // Upsert today’s meals doc with the raw meals
    const today = await DailyMeal.findOneAndUpdate(
      { userId, date },
      { meals },
      { upsert: true, new: true }
    );

    return res.json({ meals: today.meals });
  } catch (err) {
    console.error('applyGeneratedPlan error:', err);
    res.status(500).json({ error: 'Failed to apply generated plan' });
  }
};
exports.applyDietPlanToToday = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = await DietPlan.findOne({ _id: planId, userId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const date = moment().format('YYYY-MM-DD');
    // Upsert today’s meals doc with the plan’s meals
    const today = await DailyMeal.findOneAndUpdate(
      { userId, date },
      { meals: plan.meals },
      { upsert: true, new: true }
    );

    res.json({ meals: today.meals });
  } catch (err) {
    console.error('applyDietPlanToToday error:', err);
    res.status(500).json({ error: 'Failed to apply plan to today' });
  }
};




exports.addCustomMeal = async (req, res) => {
  try {
    const { userId, section, item } = req.body;        // item matches your DietMealItem shape
    const date = moment().format('YYYY-MM-DD');

    // find‐or‐create today's doc
    let today = await DailyMeal.findOne({ userId, date });
    if (!today) {
      today = new DailyMeal({
        userId,
        date,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }
      });
    }

    // push the custom item
    today.meals[section].push(item);
    await today.save();

    // respond with the updated meals
    res.json({ meals: today.meals });
  } catch (err) {
    console.error('addCustomMeal error:', err);
    res.status(500).json({ error: 'Failed to add custom meal' });
  }
};

exports.deleteMealItem = async (req, res) => {
  try {
    const { userId, section, index } = req.body;
    const date = moment().format('YYYY-MM-DD');
    const today = await DailyMeal.findOne({ userId, date });

    if (!today || !today.meals[section]?.[index]) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    today.meals[section].splice(index, 1);
    await today.save();
    res.json({ meals: today.meals });
  } catch (err) {
    console.error('deleteMealItem error:', err);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
};


exports.getTodayMeals = async (req, res) => {
  try {
    const date = moment().format('YYYY-MM-DD');
    const today = await DailyMeal.findOne({
      userId: req.query.userId,
      date
    });
    res.json({
      meals: today?.meals || {
        breakfast: [], lunch: [], dinner: [], snacks: []
      }
    });
  } catch (err) {
    console.error('getTodayMeals error:', err);
    res.status(500).json({ error: 'Failed to fetch today’s meals' });
  }
};
//get nutrition from today's meals
exports.getDietNutrition = async (req, res) => {
  try {
    const date = moment().format('YYYY-MM-DD');
    const today = await DailyMeal.findOne({
      userId: req.query.userId,
      date
    });
    const meals = today?.meals || {
      breakfast: [], lunch: [], dinner: [], snacks: []
    };
    const nutrition = Object.values(meals)
      .flat()
      .reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein:  acc.protein  + item.protein,
        carbs:    acc.carbs    + item.carbs,
        fats:     acc.fats     + item.fats
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    res.json(nutrition);
  } catch (err) {
    console.error('getDietNutrition error:', err);
    res.status(500).json({ error: 'Failed to fetch nutrition' });
  }
};





//maybe fix later
exports.addMealFromSearch = async (req, res) => {
  const { userId, mealName, section } = req.body;
  try {
    // 1) look up nutrition
    const item = await searchMeal({ mealName });

    // 2) push into today's DailyMeal
    const today = moment().format('YYYY-MM-DD');
    const updated = await DailyMeal.findOneAndUpdate(
      { userId, date: today },
      { $push: { [`meals.${section}`]: item } },
      { upsert: true, new: true }
    );

    // 3) return the updated meals
    res.json({ meals: updated.meals });
  } catch (err) {
    console.error('addMealFromSearch error:', err);
    res.status(500).json({ error: 'Failed to add searched meal' });
  }
};




exports.searchMealSuggestions = async (req, res) => {
  console.log('🔍 Got to searchMealSuggestions with', req.query);
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'query param required' });
  try {
    const { data } = await axios.get(
      'https://trackapi.nutritionix.com/v2/search/instant',
      {
        params: { query, common: true, branded: false },
        headers: {
          'x-app-id':  process.env.NUTRITIONIX_APP_ID,
          'x-app-key': process.env.NUTRITIONIX_APP_KEY
        }
      }
    );
    // return up to 10 names
    const suggestions = data.common
      .slice(0,10)
      .map(item => item.food_name);
    res.json({ suggestions });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};

// 2) Nutrition lookup + save to user’s meals
exports.searchMeal = async (req, res) => {
  const { userId, mealName, section } = req.body;
  if (!userId || !mealName || !section) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // 2a) Get nutrition facts
    const { data } = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query: mealName },
      {
        headers: {
          'x-app-id':  process.env.NUTRITIONIX_APP_ID,
          'x-app-key': process.env.NUTRITIONIX_APP_KEY,
          'Content-Type': 'application/json',
        }
      }
    );
    const f = data.foods[0];
    const item = {
      name:       f.food_name,
      calories:   f.nf_calories,
      protein:    f.nf_protein,
      carbs:      f.nf_total_carbohydrate,
      fats:       f.nf_total_fat,
      description: '',
    };

    // 2b) Save into DB (adapt to your model; here’s a sketch)
    await UserMeals.updateOne(
      { userId },
      { $push: { [`meals.${section}`]: item } },
      { upsert: true }
    );

    // 2c) Return updated meals
    const updated = await UserMeals.findOne({ userId });
    res.json({ meals: updated.meals });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to search meal' });
  }
};