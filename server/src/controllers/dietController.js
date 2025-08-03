const { searchMeal } = require('../utils/mealSearch');
const { generateDietPlan: _gen } = require('../utils/generateDietPlan');
const DietPlan   = require('../models/UserDiet');
const DailyMeal  = require('../models/DailyMeal');
const moment = require('moment');
const axios = require('axios');

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
  const { userId, cycleName, meals } = req.body;

  try {
    // 1) no more than two total
    const count = await DietPlan.countDocuments({ userId });
    if (count >= 2) {
      return res
        .status(409)
        .json({ error: 'You can only save up to two plans.' });
    }

    // 2) no duplicate name for this user
    const dup = await DietPlan.exists({ userId, cycleName });
    if (dup) {
      return res
        .status(409)
        .json({ error: 'You already have a plan with that name.' });
    }

    // 3) create and return updated list
    await DietPlan.create({ userId, cycleName, meals });
    const plans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    return res.json({ plans });
  } catch (err) {
    console.error('saveDietPlan error:', err);
    // any other error => 500
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.listDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.query.userId }).sort({
      createdAt: -1,
    });
    res.json({ plans });
  } catch (err) {
    console.error('listDietPlans error:', err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};
exports.deleteDietPlan = async (req, res) => {
  try {
    const { userId, index } = req.body;
    const all = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    if (!all[index]) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    await DietPlan.deleteOne({ _id: all[index]._id });
    const plans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (err) {
    console.error('deleteDietPlan error:', err);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};

exports.applyGeneratedPlan = async (req, res) => {
  try {
    const { userId, meals } = req.body;
    // Upsert a single doc per user
    const today = await DailyMeal.findOneAndUpdate(
      { userId },
      { meals },
      { upsert: true, new: true }
    );
    res.json({ meals: today.meals });
  } catch (err) {
    console.error('applyGeneratedPlan error:', err);
    res.status(500).json({ error: 'Failed to apply generated plan' });
  }
};

exports.applyDietPlanToToday = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = await DietPlan.findOne({ _id: planId, userId });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const today = await DailyMeal.findOneAndUpdate(
      { userId },
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
    const { userId, section, item } = req.body;

  const updated = await DailyMeal.findOneAndUpdate(
    { userId },                                // ← key off userId only
    { $push: { [`meals.${section}`]: item } }, // push into the right array
    { upsert: true, new: true }                // create if missing
  );

  return res.json({ meals: updated.meals });
};

exports.deleteMealItem = async (req, res) => {
 const { userId, section, index } = req.body;

  const board = await DailyMeal.findOne({ userId });
  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  board.meals[section].splice(index, 1);
  await board.save();
  return res.json({ meals: board.meals });
};

exports.getTodayMeals = async (req, res) => {
  const { userId } = req.query;
  const board = await DailyMeal.findOne({ userId });
  return res.json({
    meals: board?.meals || {
      breakfast: [], lunch: [], dinner: [], snacks: []
    }
  });
};

exports.getDietNutrition = async (req, res) => {
  try {
    const board = await DailyMeal.findOne({ userId: req.query.userId });
    const meals = board?.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
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

exports.addMealFromSearch = async (req, res) => {
  try {
    const { userId, mealName, section } = req.body;
    const item = await searchMeal({ mealName });

    const updated = await DailyMeal.findOneAndUpdate(
      { userId },
      { $push: { [`meals.${section}`]: item } },
      { upsert: true, new: true }
    );
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