const mongoose = require('mongoose');

const mealItem =  new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    description: { type: String, required: false }
});

const dailyMealSchema  = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true,unique: true },
    meals: {
        breakfast: [mealItem],
        lunch: [mealItem],
        dinner: [mealItem],
        snacks: [mealItem]
    },
}, { timestamps: true });

dailyMealSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMeal', dailyMealSchema);