
const mongoose = require("mongoose");

const Platform = mongoose.model(
  "Platform",
  new mongoose.Schema({
    platformType: { type: String, required: true },
    apikey: String,
appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true }

  })
);

module.exports = Platform;