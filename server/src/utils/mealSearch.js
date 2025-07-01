// server/src/utils/mealSearch.js
const axios = require('axios');

async function searchMeal({ mealName }) {
  const { data } = await axios.post(
    'https://trackapi.nutritionix.com/v2/natural/nutrients',
    { query: mealName },
    {
      headers: {
        'x-app-id':  process.env.NUTRITIONIX_APP_ID,
        'x-app-key': process.env.NUTRITIONIX_APP_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const f = data.foods[0];
  return {
    name:     f.food_name,
    calories: f.nf_calories,
    protein:  f.nf_protein,
    carbs:    f.nf_total_carbohydrate,
    fats:     f.nf_total_fat,
    // optional: you can include serving size here if you like
    description: `${f.serving_qty} ${f.serving_unit}`,
  };
}

module.exports = { searchMeal };
