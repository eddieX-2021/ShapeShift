const r = require("express").Router();
const c = require("../controllers/weightController");
r.get("/:userId", c.getWeightData);
module.exports = r;