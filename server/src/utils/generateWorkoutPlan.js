const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';

async function generateWorkoutPlan(intakeData) {
    const { goal, level, duration } = intakeData;

    const prompt = `Generate a personalized workout plan for a user with the following details:
    - Goal: ${goal}
    - Fitness Level: ${level}
    - Duration: ${duration} mins
    Return 4-6 exercises in this EXACT structure:
    1. Exercise Name: [name]
    Sets: [number]
    Reps: [number or range]
    Description: [detailed instructions]

    2. Exercise Name: [name]
    Sets: [number]
    Reps: [number or range]
    Description: [detailed instructions]

    ...and so on for each exercise.

    The plan should include a mix of strength training, cardio, and flexibility exercises, with a focus on safety and effectiveness.`;

    try {
        //look up a youtube for gemini api
        const response = await axios.post(
        GEMINI_API_URL + `?key=${GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [{ text: prompt }]
            }
            ]
        },
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
        );

        let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text
          .replace(/\*\*Exercise \d+:\s*/gi, "Exercise Name: ")
          .replace(/\*\*\s*/g, "")         // strip bold markdown
          .replace(/\*\s*/g, ""); 
        // console.log("Raw response text:", text);
        // console.log("Generated text:", parseGeminiResponse(text));
        return {
        cycleName: `${goal} (${level}) Plan`,
        exercises: parseGeminiResponse(text)
        
        };
    } catch (error) {
        console.error("Error generating workout plan:", error);
        throw new Error("Failed to generate workout plan");
    }
}
function parseGeminiResponse(text) {
  const exercises = [];
  // Split by numbered exercises (1., 2., etc.)
  const exerciseBlocks = text.split(/\d+\. Exercise Name:/).slice(1);

  for (const block of exerciseBlocks) {
    const ex = {};
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

    // First line is the exercise name (already captured by split)
    ex.name = lines[0]?.trim();

    // Process remaining lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('Sets:')) {
        ex.sets = parseInt(line.split(':')[1]) || 3;
      } else if (line.startsWith('Reps:')) {
        ex.reps = line.split(':')[1]?.trim();
      } else if (line.startsWith('Description:')) {
        ex.description = line.split(':').slice(1).join(':').trim();
      }
    }

    if (ex.name) exercises.push(ex);
  }

  return exercises;
}

module.exports = { generateWorkoutPlan };