const WeightEntry = require("../models/WeightEntry");
const moment = require("moment");

exports.getWeightData = async (req, res) => {
  const { userId } = req.params;
  const { range }  = req.query;
  let from = moment();
  switch(range){
    case "day":   from.startOf("day");   break;
    case "week":  from.startOf("isoWeek");break;
    case "month": from.startOf("month"); break;
    case "year":  from.startOf("year");  break;
    default:      from.subtract(1, "year");
  }
  const docs = await WeightEntry
    .find({ userId, date: { $gte: from.toDate() } })
    .sort({ date: 1 });
  res.json(docs.map(d => ({ date: d.date, weight: d.weight })));
};