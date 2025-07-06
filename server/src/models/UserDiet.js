// server/models/UserDiet.js
const mongoose = require('mongoose');

const mealItem = new mongoose.Schema({
  name:        { type: String, required: true },
  calories:    { type: Number, required: true },
  protein:     { type: Number, required: true },
  carbs:       { type: Number, required: true },
  fats:        { type: Number, required: true },
  description: { type: String, required: false },
});

// no more `unique: true` on userId or cycleName here:
const aiDietPlanSchema = new mongoose.Schema({
  userId:    { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  cycleName: { type: String, required: true },
  meals: {
    breakfast: [ mealItem ],
    lunch:     [ mealItem ],
    dinner:    [ mealItem ],
    snacks:    [ mealItem ],
  },
}, { timestamps: true });

// compound index: only one plan name *per user*,
// and no restriction on how many total (we’ll enforce “≤2” in code)
aiDietPlanSchema.index(
  { userId: 1, cycleName: 1 },
  { unique: true, name: 'user_cycle_unique' }
);

module.exports = mongoose.model('DietPlan', aiDietPlanSchema);
