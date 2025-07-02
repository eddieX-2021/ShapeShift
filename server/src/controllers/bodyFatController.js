const BodyFatEntry = require("../models/BodyFatEntry");
const moment = require("moment");

exports.getBodyFatData = async (req, res) => {
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
  const docs = await BodyFatEntry
    .find({ userId, date: { $gte: from.toDate() } })
    .sort({ date: 1 });
  res.json(docs.map(d => ({ date: d.date, bodyFat: d.bodyFat })));
};