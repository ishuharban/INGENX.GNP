//DLC
const mongoose = require('mongoose');
const DealLifeCycle = mongoose.Schema({
    Dealid :{
        type:Number,
        require:true,
        unique:true
    },
    patnerid :{
        type:Number,
        require:true
    },
    dealname:{
        type:String,
        require:true
    },
    companyname :{
        type:String,
        require:true
    },
    typeofcustomer:{
        type:String,
        require:true
    },
    productname:{
        type:String,
        require:true
    },
    opportunity:{
        type:String,
        require:true
    },
    currenterp:{
        type:String,
        require:true
    },  
    numberofuser:{
        type:String,
        require:true
    },
},
{timestamps:true}
);

module.exports= mongoose.model('Deal_lc', DealLifeCycle );