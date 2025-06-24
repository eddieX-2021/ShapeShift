// scripts/fixPlannerDB.js

/**
 * Run this script once to normalize your ManualPlanner documents:
 *   node scripts/fixPlannerDB.js
 */

const mongoose = require('mongoose');
const { ManualPlanner } = require('../src/models/WorkoutPlan'); // adjust path if needed

// 7 days of the week, lowercase
const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

async function fixPlanners() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';
  await mongoose.connect(uri);

  const all = await ManualPlanner.find();
  console.log(`Found ${all.length} planner documents. Beginning normalization...`);

  for (const doc of all) {
    const original = doc.planner || {};
    const fixed = {};

    // build new planner object with only lowercase keys
    for (const day of DAYS) {
      const title = day.charAt(0).toUpperCase() + day.slice(1);

      // pull arrays from both lowercase and Title-case
      const lowerArr = Array.isArray(original[day]) ? original[day] : [];
      const upperArr = Array.isArray(original[title]) ? original[title] : [];

      // merge them (you can also dedupe by name if you want)
      fixed[day] = [...lowerArr, ...upperArr];
    }

    // update document
    await ManualPlanner.updateOne(
      { _id: doc._id },
      { 
        $set:   { planner: fixed },
        $unset: DAYS.reduce((u, day) => {
                   const title = day.charAt(0).toUpperCase() + day.slice(1);
                   u[`planner.${title}`] = "";
                   return u;
                 }, {})
      }
    );
    console.log(` → normalized planner for userId=${doc.userId} (_id=${doc._id})`);
  }

  console.log('All planners have been normalized. Disconnecting...');
  await mongoose.disconnect();
  process.exit(0);
}

fixPlanners().catch(err => {
  console.error('Error normalizing planners:', err);
  process.exit(1);
});
