const r = require("express").Router();
const c = require("../controllers/bodyFatController");
r.get("/:userId", c.getBodyFatData);
module.exports = r;