const { generateWorkoutPlan } = require('../utils/generateWorkoutPlan');
const { AIPlan, ManualPlanner } = require('../models/WorkoutPlan');
//generate plan
exports.generatePlan = async (req, res) => {
    const{goal, level, duration} =  req.body;
    try{
        const plan = await generateWorkoutPlan({ goal, level, duration });
        res.json({ plan });
    }catch (error) {
        console.error("Error generating plan:", error);
        res.status(500).json({ error: "Failed to generate workout plan" });
    }
}
//store generated plan
exports.saveAIPlan = async (req, res) => {
    const { userId, cycleName, exercises } = req.body;
    try {
        await AIPlan.create({ userId, cycleName, exercises });
        const userPlans = await AIPlan.find({ userId }).sort({ createdAt: -1 });
        if (userPlans.length > 2) {
            const toDelete = userPlans.slice(2);
            await AIPlan.deleteMany({ _id: { $in: toDelete.map(plan => plan._id) } });
        }
        res.status(201).json({ message: "AI Plan saved successfully", AIPlan });
    } catch (error) {
        console.error("Error saving AI Plan:", error);
        res.status(500).json({ error: "Failed to save AI Plan" });
    }
}
//get generated plan
exports.getAIPlans = async (req, res) => {
    try{
        const plans = await AIPlan.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ plans });
    }catch (error) {
        console.error("Error fetching AI Plans:", error);
        res.status(500).json({ error: "Failed to fetch AI Plans" });
    }
}

//store monday to sunday plan
exports.saveManualPlan = async (req, res) => {
    const { userId, planner } = req.body;
    try {
        await ManualPlanner.findOneAndUpdate({ userId }, { planner }, { upsert: true, new: true });
        res.status(201).json({ message: "Manual plan saved successfully" });
    }
    catch (error) {
        console.error("Error saving manual plan:", error);
        res.status(500).json({ error: "Failed to save manual plan" });
    }
}

//get monday to sunday plan
exports.getManualPlanner = async (req, res) => {
    try {
        const planner = await ManualPlanner.findOne({ userId: req.params.userId });
        res.json({ planner: planner?.planner || {} });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve manual planner" });
    }
};


exports.updateDayInPlanner = async (req, res) => {
  const { userId, day, workouts } = req.body;
  const dayKey = day.toLowerCase();

  if (!userId || !day || !workouts) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updated = await ManualPlanner.findOneAndUpdate(
      { userId },
      { $set: { [`planner.${dayKey}`]: workouts } }, // update only one day
      { upsert: true, new: true }
    );

    res.json({ success: true, planner: updated.planner });
  } catch (err) {
    console.error("Planner update error:", err);
    res.status(500).json({ error: "Failed to update day in planner" });
  }
};

// Add this to your exerciseController.js
exports.deleteAIPlan = async (req, res) => {
    const { userId, planId } = req.params;
    try {
        // Verify the plan belongs to the user before deleting
        const plan = await AIPlan.findOne({ _id: planId, userId });
        if (!plan) {
            return res.status(404).json({ error: "Plan not found or doesn't belong to user" });
        }

        await AIPlan.deleteOne({ _id: planId });
        const remainingPlans = await AIPlan.find({ userId }).sort({ createdAt: -1 });
        res.json({ 
            message: "Plan deleted successfully",
            plans: remainingPlans
        });
    } catch (error) {
        console.error("Error deleting AI Plan:", error);
        res.status(500).json({ error: "Failed to delete AI Plan" });
    }
}


exports.addWorkoutToDays = async (req, res) => {
  const { userId, days, workout } = req.body;
  if (!userId || !Array.isArray(days) || !workout?.name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // build a $push for each day
  const pushOps = {};
  days.forEach(day => {
    const key = `planner.${day.toLowerCase()}`;
    pushOps[key] = workout;
  });

  try {
    const updated = await ManualPlanner.findOneAndUpdate(
      { userId },
      { $push: pushOps },
      { new: true, upsert: true }
    );
    res.json({ success: true, planner: updated.planner });
  } catch (err) {
    console.error("Error adding workout to days:", err);
    res.status(500).json({ error: "Server error" });
  }
};