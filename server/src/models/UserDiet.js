const mongoose = require('mongoose');

const mealItem =  new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    description: { type: String, required: false }
});

const aiDietPlanSchema  = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true},
    cycleName: { type: String, required: true },
    meals: {
        breakfast: [mealItem],
        lunch: [mealItem],
        dinner: [mealItem],
        snacks: [mealItem]
    },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', aiDietPlanSchema);
