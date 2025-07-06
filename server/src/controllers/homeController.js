const mongoose         = require('mongoose');
const moment           = require('moment');
const IntakeEntry      = require('../models/IntakeEntry');
const DailyMeal        = require('../models/DailyMeal');
const { ManualPlanner } = require('../models/WorkoutPlan');


// Helper to grab userId from either route-param or query-string
function getUserId(req) {
  return req.params.userId || req.query.userId;
}


// If the string is a valid ObjectId, convert it; otherwise leave it as-is
function toObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : id;
}
exports.getWeightData = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { range } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    // compute cutoff moment
    let start = moment().utc();
    switch (range) {
      case 'day':   start = start.startOf('day');      break;
      case 'week':  start = start.subtract(7, 'days'); break;
      case 'month': start = start.subtract(1, 'month');break;
      case 'year':  start = start.subtract(1, 'year'); break;
      default:      start = moment(0);
    }

    // format back to "YYYY-MM-DD" to match your stored strings
    const cutoff = start.format('YYYY-MM-DD');

    // now string-wise compare and sort lexicographically
    const entries = await IntakeEntry.find({
      userId,
      date: { $gte: cutoff }
    }).sort({ date: 1 });

    const data = entries.map(e => ({
      date:   e.date,
      weight: e.weight
    }));
    return res.json(data);

  } catch (err) {
    console.error('getWeightData:', err);
    return res.status(500).json({ error: 'Failed to fetch weight data' });
  }
};
exports.getBodyFatData = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { range } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    let start = moment().utc();
    switch (range) {
      case 'day':   start = start.startOf('day');      break;
      case 'week':  start = start.subtract(7, 'days'); break;
      case 'month': start = start.subtract(1, 'month');break;
      case 'year':  start = start.subtract(1, 'year'); break;
      default:      start = moment(0);
    }

    const cutoff = start.format('YYYY-MM-DD');

    const entries = await IntakeEntry.find({
      userId,
      date: { $gte: cutoff }
    }).sort({ date: 1 });

    const data = entries.map(e => ({
      date:    e.date,
      bodyFat: e.bodyFat?.value ?? null
    }));
    return res.json(data);

  } catch (err) {
    console.error('getBodyFatData:', err);
    return res.status(500).json({ error: 'Failed to fetch body-fat data' });
  }
};


// ————————————————————————————————
// 3) TODAY’S INTAKE (BMI ONLY)
exports.getTodayIntake = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'userId is required' });


    const today = moment().format('YYYY-MM-DD');
    const entry = await IntakeEntry.findOne({ userId, date: today });


    // Only return the BMI (or null)
    return res.json({ bmi: entry?.bmi ?? null });
  } catch (err) {
    console.error('getTodayIntake:', err);
    return res.status(500).json({ error: 'Failed to fetch today’s BMI' });
  }
};


// ————————————————————————————————
// 4) TODAY’S MEALS
exports.getTodayMeals = async (req, res) => {
  try {
    const rawId = getUserId(req);
    if (!rawId) return res.status(400).json({ error: 'userId is required' });

    const userId = toObjectId(rawId);

    // use UTC so you pick up the 00:00:00Z documents
    const start = moment.utc().startOf('day').toDate();
    const end   = moment.utc().add(1, 'day').startOf('day').toDate();

    console.log('getTodayMeals:', { userId, start, end });
    const daily = await DailyMeal.findOne({
      userId,
      date: { $gte: start, $lt: end },
    });
    console.log(' → daily from DB:', daily);

    return res.json({
      meals: daily?.meals ?? { breakfast: [], lunch: [], dinner: [], snacks: [] },
    });
  } catch (err) {
    console.error('getTodayMeals error:', err);
    return res.status(500).json({ error: 'Failed to fetch today’s meals' });
  }
};


exports.getNutrition = async (req, res) => {
  try {
    const rawId = getUserId(req);
    if (!rawId) return res.status(400).json({ error: 'userId is required' });

    const userId = toObjectId(rawId);
    const start  = moment.utc().startOf('day').toDate();
    const end    = moment.utc().add(1, 'day').startOf('day').toDate();

    console.log('getNutrition:', { userId, start, end });
    const daily = await DailyMeal.findOne({
      userId,
      date: { $gte: start, $lt: end },
    });
    console.log(' → daily from DB:', daily);

    const nutrition = Object.values(daily?.meals ?? {})
      .flat()
      .reduce((tot, item) => ({
        calories: tot.calories + (item.calories || 0),
        protein:  tot.protein  + (item.protein  || 0),
        carbs:    tot.carbs    + (item.carbs    || 0),
        fats:     tot.fats     + (item.fats     || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    console.log(' → nutrition computed:', nutrition);
    return res.json(nutrition);

  } catch (err) {
    console.error('getNutrition error:', err);
    return res.status(500).json({ error: 'Failed to fetch today’s nutrition' });
  }
};
exports.getTodayExercises = async (req, res) => {
  const { userId } = req.query;
  const plan       = await ManualPlanner.findOne({ userId });
  if (!plan) return res.json([]);
  const dayKey = moment().format("dddd").toLowerCase(); // e.g. "monday"
  const list   = plan.planner[dayKey] || [];
  res.json(
    list.map((w, i) => ({
      // if you need a stable id, use w._id; else index is fine
      id:   w._id?.toString() ?? i,
      name: w.name
    }))
  );
};
exports.completeExercise = async (req, res) => {
  const { userId, taskId } = req.body;
  const dayKey = moment().format("dddd").toLowerCase(); // e.g. "monday"


  // fetch that user’s planner
  const plan = await ManualPlanner.findOne({ userId });
  if (!plan) {
    return res.status(404).json({ error: "No planner found" });
  }


  // find the workout subdocument and flag it
  const workout = plan.planner[dayKey].id(taskId);
  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }


  workout.completed = true;   // ← you’ll need to add this field to the schema (see below)
  await plan.save();
  res.json({ success: true });
};





