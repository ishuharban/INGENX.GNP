const mongoose =require("mongoose");

const filterSchema =new mongoose.Schema({
    dealname:{
        type:String
    },
    customername:{
        type : String
    }
});

const Filter =mongoose.model("Filter",filterSchema);

module.exports={
    Filter
}