const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  opptype: {
    type: String,
    required: true,
    unique: true,
  },
  
});

module.exports = mongoose.model("OppType", productSchema);