// utils/generateDietPlan.js
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL   = 'gemini-1.5-flash';
const GEMINI_URL     =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Parse Gemini’s response into up to 3 meals per section,
 * each with name, calories, protein, carbs, fats, and recipe.
 */
function parseGeminiResponse(text) {
  const result = { breakfast: [], lunch: [], dinner: [], snacks: [] };
  // normalize newlines
  const clean = text.replace(/\r/g, '');

  for (const section of ['Breakfast','Lunch','Dinner','Snacks']) {
    const secLower = section.toLowerCase();
    // grab the block for this section
    const secRe = new RegExp(
      `${section}:[\\s\\S]*?(?=(?:Breakfast|Lunch|Dinner|Snacks):|$)`,
      'i'
    );
    const match = secRe.exec(clean);
    if (!match) continue;

    // split out each numbered item (1., 2., 3.)
    const block    = match[0];
    const itemsRaw = block.split(/^\d+\.\s*/m).slice(1).slice(0,3); // up to 3 items

    for (const itemText of itemsRaw) {
      // split into lines
      const lines = itemText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      // 1) Name
      const nameMatch = lines.find(l => /(?:Meal|Snack) Name:/i.test(l))?.match(/(?:Meal|Snack) Name:\s*(.+)/i);
      const name      = nameMatch ? nameMatch[1].trim() : '';

      // 2) Calories
      const calMatch  = lines.find(l => /^Calories:/i.test(l))?.match(/Calories:\s*(\d+)/i);
      const calories  = calMatch ? parseInt(calMatch[1], 10) : null;

      // 3) Nutrients
      const nutLine   = lines.find(l => /^Nutrients:/i.test(l)) || '';
      const nutMatch  = nutLine.match(/(\d+)\s*g\s*protein.*?(\d+)\s*g\s*carbs.*?(\d+)\s*g\s*fats/i);
      const protein   = nutMatch ? parseInt(nutMatch[1], 10) : null;
      const carbs     = nutMatch ? parseInt(nutMatch[2], 10) : null;
      const fats      = nutMatch ? parseInt(nutMatch[3], 10) : null;

      // 4) Recipe (rest of the line after "Recipe:")
      const recMatch  = lines.find(l => /^Recipe:/i.test(l))?.match(/Recipe:\s*(.+)/i);
      const recipe    = recMatch ? recMatch[1].trim() : '';

      result[secLower].push({ name, calories, protein, carbs, fats, recipe });
    }
  }

  return result;
}

async function generateDietPlan({ goal, description, dietRestriction }) {
  const prompt = `
Generate a **personalized diet plan** with **1–3 meals** per section (Breakfast, Lunch, Dinner, Snacks).  
For each meal, include:
- Meal Name
- Calories  
- Nutrients (protein, carbs, fats)  
- A short Recipe  

Return **exactly** in this format:

Breakfast:
1. Meal Name: [name]
Calories: [number]
Nutrients: [protein]g protein, [carbs]g carbs, [fats]g fats
Recipe: [one-sentence recipe]

2. Meal Name: …
…  

Lunch:
1. Meal Name: …
…

…and so on for Dinner and Snacks.
`;

  const { data } = await axios.post(
    GEMINI_URL,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const text  = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('🔍 Raw Gemini response:\n', text);
  const meals = parseGeminiResponse(text);
  console.log('✅ Parsed meals:', meals);

  return {
    cycleName: `${goal} Plan`,
    meals
  };
}

module.exports = { generateDietPlan };
