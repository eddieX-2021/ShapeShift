const IntakeEntry = require('../models/IntakeEntry');
const moment = require('moment');
const calculateNavyMethod = require('../utils/navyMethod');

exports.checkIntakeToday = async (req, res) => {
  const { userId } = req.query;
  const today = moment().format('YYYY-MM-DD');
  const entry = await IntakeEntry.findOne({ userId, date: today });

  return res.json({ completed: !!entry });
};

exports.submitIntake = async (req, res) => {
  const { userId, weight, bmi, bodyFat, navyInputs } = req.body;
  const today = moment().format('YYYY-MM-DD');

  const exists = await IntakeEntry.findOne({ userId, date: today });
  if (exists) return res.status(400).json({ error: "Already submitted today" });

  let bodyFatResult = null;

  if (bodyFat) {
    bodyFatResult = {
      value: parseFloat(bodyFat),
      estimated: false,
    };
  } else if (navyInputs) {
    try {
      const fatValue = calculateNavyMethod(navyInputs);
      bodyFatResult = {
        value: parseFloat(fatValue.toFixed(1)),
        estimated: true,
      };
    } catch (err) {
      return res.status(400).json({ error: "Invalid Navy Method inputs" });
    }
  } else {
    return res.status(400).json({ error: "Body fat input is required (manual or navyInputs)" });
  }

  const newEntry = new IntakeEntry({
    userId,
    date: today,
    weight,
    bmi,
    bodyFat: bodyFatResult,
  });

  await newEntry.save();
  return res.json({ message: "Intake submitted successfully" });
};
