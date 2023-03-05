const mongoose = require("mongoose");

const Company = mongoose.model(
  "Company",
  new mongoose.Schema({
    name: String,
    website: String,
    service:String,
    apps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }]


  })
);

module.exports = Company;