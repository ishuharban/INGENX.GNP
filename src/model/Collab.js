
const mongoose = require('mongoose');


 const collabschema =  mongoose.Schema({

    companyname: {
        type: String,
        require: true
    },
    Dealid :{
        type:Number,
        require:true,
        unique:true
    },
    address:{
        type: String,
        require: true       
    },
    gstno: {
        type: String,
        require: true,
        unique: true
    },
    phoneno:{
        type: Number,
        require: true   
    },
    businessemail: {
        type: String,
        require: true,
        unique: true
    },
    currenterp:{
        type:String,
        require:true
    },
    numberofuser:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},
{timestamps:true}
);

const Collab = mongoose.model('Collab',collabschema);




module.exports = { Collab};
