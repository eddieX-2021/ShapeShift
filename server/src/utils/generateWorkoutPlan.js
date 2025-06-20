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
    Return 4-6 exercises in this structure:
    Exercise Name: ...
    Sets: ...
    Reps: ...
    Description: ...
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
  const blocks = text.split(/\n\s*\n/); // split by blank lines

  for (const block of blocks) {
    const ex = {};
    const lines = block.split('\n');

    for (const line of lines) {
      if (/exercise name/i.test(line)) {
        ex.name = line.split(':')[1]?.trim();
      } else if (/sets/i.test(line)) {
        ex.sets = parseInt(line.split(':')[1]) || 3;
      } else if (/reps/i.test(line)) {
        ex.reps = line.split(':')[1]?.trim();
      } else if (/description/i.test(line)) {
        ex.description = line.split(':')[1]?.trim();
      }
    }

    // Only push if name exists
    if (ex.name) exercises.push(ex);
  }

  return exercises;
}

module.exports = { generateWorkoutPlan };