const mongoose = require("mongoose");

const App = mongoose.model(
  "App",
  new mongoose.Schema({
    name: String,
    website: String,
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    platforms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Platform' }]

  })
);


module.exports = App