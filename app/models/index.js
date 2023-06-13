const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.portfolio = require("./portfolio.model");
db.project = require("./project.model");
db.task = require("./task.model");
db.people = require("./people.model");

db.ROLES = ["user", "manager"];

module.exports = db;
