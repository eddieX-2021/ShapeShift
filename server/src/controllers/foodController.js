// server/src/controllers/foodController.js
require('dotenv').config();
const axios  = require('axios');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const CLARIFAI_KEY      = process.env.CLARIFAI_API_KEY;
const MODEL_ID          = "food-item-recognition";
const MODEL_VERSION_ID  = "1d5fd481e0cf4826aa72ec3ff049e044"; // from Clarifai UI
const NUTRI_APP_ID      = process.env.NUTRITIONIX_APP_ID;
const NUTRI_APP_KEY     = process.env.NUTRITIONIX_APP_KEY;

exports.scanFood = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      // 1) Clarifai REST call with explicit version
      const clarifaiRes = await axios.post(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        {
          inputs: [{
            data: {
              image: { base64: req.file.buffer.toString("base64") }
            }
          }]
        },
        {
          headers: {
            "Authorization": `Key ${CLARIFAI_KEY}`,
            "Content-Type":  "application/json",
          }
        }
      );

      const concepts = clarifaiRes.data.outputs[0].data.concepts;
      const bestFood = concepts[0].name; // e.g. "pizza"

      // 2) Nutritionix lookup (same as before)
      const nutriRes = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: bestFood },
        {
          headers: {
            "x-app-id":  NUTRI_APP_ID,
            "x-app-key": NUTRI_APP_KEY,
            "Content-Type": "application/json",
          }
        }
      );

      const f = nutriRes.data.foods[0];
      return res.json({
        name:        f.food_name,
        calories:    f.nf_calories,
        protein:     f.nf_protein,
        carbs:       f.nf_total_carbohydrate,
        fats:        f.nf_total_fat,
        servingQty:  f.serving_qty,
        servingUnit: f.serving_unit,
      });

    } catch (err) {
      console.error("Scan error:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to scan food" });
    }
  }
];
