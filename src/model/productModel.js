const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
    unique: true,
  },
  
});

module.exports = mongoose.model("Product", productSchema);
