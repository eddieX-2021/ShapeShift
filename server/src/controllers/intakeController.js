// server/src/controllers/intakeController.js
const IntakeEntry = require('../models/IntakeEntry');
const moment = require('moment');
const calculateNavyMethod = require('../utils/navyMethod');

exports.checkIntakeToday = async (req, res) => {
  try {
    const { userId } = req.query;
    const today = moment().format('YYYY-MM-DD');
    const entry = await IntakeEntry.findOne({ userId, date: today });
    return res.json({ completed: !!entry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.submitIntake = async (req, res) => {
  try {
    const {
      userId,
      weight: weightRaw,
      bmi:   bmiRaw,
      bodyFat: bfManualRaw,
      navyInputs
    } = req.body;

    // 1) Basic required checks
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const today = moment().format('YYYY-MM-DD');

    // 2) Parse weight & BMI
    const weight = parseFloat(weightRaw);
    const bmi    = parseFloat(bmiRaw);
    if (isNaN(weight)) {
      return res.status(400).json({ error: 'Please enter a valid weight' });
    }
    if (isNaN(bmi)) {
      return res.status(400).json({ error: 'Please enter a valid BMI' });
    }

    // 3) Build bodyFatResult
    let bodyFatResult = null;

    // → manual override
    if (bfManualRaw !== undefined && bfManualRaw !== null && bfManualRaw !== '') {
      const bfValue = parseFloat(bfManualRaw);
      if (isNaN(bfValue)) {
        return res.status(400).json({ error: 'Please enter a valid body-fat percentage' });
      }
      bodyFatResult = { method: 'manual', value: bfValue };
    }
    // → Navy formula
    else if (navyInputs && typeof navyInputs === 'object') {
      const { gender, height: hRaw, waist: wRaw, neck: nRaw, hip: hipRaw } = navyInputs;
      const height = parseFloat(hRaw);
      const waist  = parseFloat(wRaw);
      const neck   = parseFloat(nRaw);
      const hip    = hipRaw !== undefined ? parseFloat(hipRaw) : undefined;

      if (!['male','female'].includes(gender)) {
        return res.status(400).json({ error: 'Gender must be "male" or "female"' });
      }
      if (
        isNaN(height) ||
        isNaN(waist)  ||
        isNaN(neck)   ||
        (gender === 'female' && isNaN(hip))
      ) {
        return res
          .status(400)
          .json({ error: 'Please fill in all numeric fields for Navy method' });
      }

      const bfCalc = calculateNavyMethod({
        Gender: gender,
        Height: height,
        Waist:  waist,
        Neck:   neck,
        Hip:    gender === 'female' ? hip : undefined,
      });

      if (isNaN(bfCalc)) {
        return res
          .status(400)
          .json({ error: 'Body-fat calculation error. Check your measurements.' });
      }

      bodyFatResult = { method: 'navy', value: bfCalc };
    }
    // → nothing provided
    else {
      return res
        .status(400)
        .json({ error: 'You must provide body-fat manually or via Navy method' });
    }

    // 4) Save to Mongo
    const entry = new IntakeEntry({
      userId,
      date:   today,
      weight,
      bmi,
      bodyFat: bodyFatResult,
    });

    await entry.save();
    return res.json({ message: 'Intake submitted successfully' });
  } catch (err) {
    console.error('submitIntake error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
