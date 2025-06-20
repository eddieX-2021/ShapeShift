const { generateWorkoutPlan } = require('../utils/generateWorkoutPlan');
const searchExercises = require('../utils/searchExercises');
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

//search exercises
exports.searchExercises = async (req, res) => {
    const query = req.query.q || '';
    const results = await searchExercises(query);
    res.json(results);
}