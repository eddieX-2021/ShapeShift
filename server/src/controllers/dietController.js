const { searchMeal } = require('../utils/mealSearch');
const { generateDietPlan: _gen } = require('../utils/generateDietPlan');
const DietPlan   = require('../models/UserDiet');
const DailyMeal  = require('../models/DailyMeal');

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

exports.searchMealSuggestions = async (req, res) => { /* … unchanged … */ };
exports.searchMeal             = async (req, res) => { /* … unchanged … */ };
