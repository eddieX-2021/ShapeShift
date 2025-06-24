const mongoose = require('mongoose');

//database for exercises
const exerciseSchema =  new mongoose.Schema({
    name : { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    description: { type: String, required: false },
});

//ai plan 
const aiPlanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    cycleName: { type: String, required: true },
    exercises: [exerciseSchema],
    createdAt: { type: Date, default: Date.now },
});

//planner board
const manualPlannerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    planner : {
        monday: [exerciseSchema],
        tuesday: [exerciseSchema],
        wednesday: [exerciseSchema],
        thursday: [exerciseSchema],
        friday: [exerciseSchema],
        saturday: [exerciseSchema],
        sunday: [exerciseSchema],
    },
});

const AIPlan = mongoose.model("AIPlan", aiPlanSchema);
const ManualPlanner = mongoose.model("ManualPlanner", manualPlannerSchema);

module.exports = { AIPlan, ManualPlanner };