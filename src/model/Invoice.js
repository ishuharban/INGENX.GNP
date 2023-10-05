const mongoose = require("mongoose");
const Invoice = mongoose.Schema(
  {
    compnayname:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "register",
    },
    Gstnno:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "register",
    },
    dealname:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "DealRegister",
    },
    invoiceid:String ,
    invoice_date:Date,
    invoice_number:Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("invoice",Invoice);