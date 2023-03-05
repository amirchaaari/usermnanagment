const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.app =require("./app.model")
db.company=require("./company.model")
db.platform=require("./platform.model")


db.ROLES = ["admin", "supervisor","ecommerce-owner","fraud-analyst"];

module.exports = db;